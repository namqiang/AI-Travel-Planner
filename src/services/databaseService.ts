import { supabase } from '@/lib/supabase'
import { TravelPlan, Expense } from '@/types'

export const databaseService = {
  // ========== 旅行计划 ==========

  // 创建旅行计划
  async createPlan(plan: Omit<TravelPlan, 'id' | 'created_at' | 'updated_at'>): Promise<TravelPlan> {
    const { data, error } = await supabase
      .from('travel_plans')
      .insert([plan])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 获取用户的所有旅行计划
  async getUserPlans(userId: string): Promise<TravelPlan[]> {
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // 获取单个旅行计划
  async getPlan(planId: string): Promise<TravelPlan> {
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (error) throw error
    return data
  },

  // 更新旅行计划
  async updatePlan(planId: string, updates: Partial<TravelPlan>): Promise<TravelPlan> {
    const { data, error } = await supabase
      .from('travel_plans')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', planId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 删除旅行计划
  async deletePlan(planId: string): Promise<void> {
    const { error } = await supabase
      .from('travel_plans')
      .delete()
      .eq('id', planId)

    if (error) throw error
  },

  // ========== 费用记录 ==========

  // 添加费用记录
  async addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 获取计划的所有费用记录
  async getPlanExpenses(planId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('plan_id', planId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  // 更新费用记录
  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 删除费用记录
  async deleteExpense(expenseId: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)

    if (error) throw error
  },

  // 获取计划的总费用
  async getPlanTotalExpense(planId: string): Promise<number> {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .eq('plan_id', planId)

    if (error) throw error

    return (data || []).reduce((sum, expense) => sum + expense.amount, 0)
  },
}
