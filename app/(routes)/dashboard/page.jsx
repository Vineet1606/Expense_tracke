"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo';
import { db } from '../../../utils/dbConfig';
import { budgets, Expenses } from '../../../utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import BarChartdashboard from '../dashboard/_components/BarChartDashboard'
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';

function Dashboard() {
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
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hi, {user?.fullName} </h2>
      <p className='text-gray-500'>Here's what happening with your money
        let's manage your expense
      </p>
      <CardInfo budgetList={budgetList}/>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarChartdashboard
          budgetList={budgetList}/>
          <ExpenseListTable
        expenseList={expensesList}
        refreshData={()=>getBudgetList()}
        />
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budget</h2>
          {budgetList.map((budget,index)=>(
            <BudgetItem  budget={budget} key={index}/>
          ))}
        </div>

      </div>
    </div>
  )
}

export  default Dashboard