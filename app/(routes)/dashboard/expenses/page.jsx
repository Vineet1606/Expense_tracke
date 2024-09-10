"use client"
import React from 'react'
import ExpenseListTable from '../expenses/_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useEffect } from 'react';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../../../../utils/dbConfig';
import { budgets, Expenses } from '../../../../utils/schema';
function page() {
    const {user}=useUser();
  const[budgetList,setBudgetList]=useState([]);
  const[expensesList,setExpensesList]=useState([]);

  useEffect(()=>{
    user&&getBudgetList();
  },[user])
const getBudgetList=async()=>{
  const result=await db.select({
    ...getTableColumns(budgets),
    totalSpend: sql `sum(${Expenses.amount})`.mapWith(Number),
    totalItem: sql `count(${Expenses.id})`.mapWith(Number)
  }).from(budgets)
  .leftJoin(Expenses,eq(budgets.id,Expenses.budgetId))
  .where(eq(budgets.createdBy,user.primaryEmailAddress?.emailAddress))
  .groupBy(budgets.id)
  .orderBy(desc(budgets.id));
  setBudgetList(result);
  // console.log(result);
  getAllExpense();
}

const getAllExpense=async()=>{
  const result=await db.select({
    id:Expenses.id,
    name:Expenses.name,
    amount:Expenses.amount,
    createdAt:Expenses.createdAt
  }).from(budgets)
  .rightJoin(Expenses,eq(budgets.id,Expenses.budgetId))
  .where(eq(budgets.createdBy,user?.primaryEmailAddress.emailAddress))
  .orderBy(desc(Expenses.id));
  setExpensesList(result);
  // console.log(result);
  
}
  return (
    <div className='ml-5 '>
        <h2 className='font-bold text-3xl mt-3'>My Expenses</h2>
    <div>
        <ExpenseListTable
        expenseList={expensesList}
        refreshData={()=>getBudgetList()}
        />
    </div>
    </div>
  )
}

export default page