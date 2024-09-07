"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '../../../../../utils/dbConfig'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { budgets, Expenses } from '../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {

  const[budgetList,setBudgetList]=useState([]);
  const {user}=useUser();
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
  .groupBy(budgets.id);
  setBudgetList(result);
  // console.log(result);
}

  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5'>
            <CreateBudget/>
            {budgetList.map((budget, index) => (
              <BudgetItem key={index} budget={budget} />
            ))}

            {/* {budgetList.map((budget,index)=>{
              <BudgetItem budget={budget}/>
            })} */}
        </div>
    </div>
  )
}

export default BudgetList