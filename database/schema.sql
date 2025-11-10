-- AI Travel Planner 数据库表结构
-- 在 Supabase SQL 编辑器中执行此脚本

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 旅行计划表
CREATE TABLE IF NOT EXISTS travel_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC(10, 2) NOT NULL,
  travelers INTEGER NOT NULL DEFAULT 1,
  preferences JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  expenses JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 费用记录表
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES travel_plans(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON travel_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_plans_created_at ON travel_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_plan_id ON expenses(plan_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 travel_plans 表添加自动更新时间戳触发器
CREATE TRIGGER update_travel_plans_updated_at
BEFORE UPDATE ON travel_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 旅行计划表的安全策略
-- 用户只能查看自己的旅行计划
CREATE POLICY "Users can view their own travel plans"
ON travel_plans
FOR SELECT
USING (auth.uid() = user_id);

-- 用户可以创建自己的旅行计划
CREATE POLICY "Users can create their own travel plans"
ON travel_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的旅行计划
CREATE POLICY "Users can update their own travel plans"
ON travel_plans
FOR UPDATE
USING (auth.uid() = user_id);

-- 用户可以删除自己的旅行计划
CREATE POLICY "Users can delete their own travel plans"
ON travel_plans
FOR DELETE
USING (auth.uid() = user_id);

-- 费用记录表的安全策略
-- 用户只能查看自己旅行计划的费用记录
CREATE POLICY "Users can view expenses of their own travel plans"
ON expenses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM travel_plans
    WHERE travel_plans.id = expenses.plan_id
    AND travel_plans.user_id = auth.uid()
  )
);

-- 用户可以为自己的旅行计划添加费用记录
CREATE POLICY "Users can create expenses for their own travel plans"
ON expenses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM travel_plans
    WHERE travel_plans.id = expenses.plan_id
    AND travel_plans.user_id = auth.uid()
  )
);

-- 用户可以更新自己旅行计划的费用记录
CREATE POLICY "Users can update expenses of their own travel plans"
ON expenses
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM travel_plans
    WHERE travel_plans.id = expenses.plan_id
    AND travel_plans.user_id = auth.uid()
  )
);

-- 用户可以删除自己旅行计划的费用记录
CREATE POLICY "Users can delete expenses of their own travel plans"
ON expenses
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM travel_plans
    WHERE travel_plans.id = expenses.plan_id
    AND travel_plans.user_id = auth.uid()
  )
);

-- 创建视图：用户旅行计划统计
CREATE OR REPLACE VIEW user_travel_stats AS
SELECT
  user_id,
  COUNT(*) AS total_plans,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_plans,
  SUM(budget) AS total_budget,
  AVG(budget) AS avg_budget
FROM travel_plans
GROUP BY user_id;

-- 注释
COMMENT ON TABLE travel_plans IS '旅行计划表，存储用户的旅行行程信息';
COMMENT ON TABLE expenses IS '费用记录表，存储旅行计划的开销记录';
COMMENT ON COLUMN travel_plans.itinerary IS '行程安排，JSON 格式存储每日活动详情';
COMMENT ON COLUMN travel_plans.preferences IS '旅行偏好，JSON 数组格式';
COMMENT ON COLUMN travel_plans.status IS '计划状态: draft(草稿), confirmed(已确认), completed(已完成)';
