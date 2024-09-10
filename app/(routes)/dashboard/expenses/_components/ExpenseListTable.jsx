import { Trash } from 'lucide-react'
import React from 'react'
import { db } from '../../../../../utils/dbConfig'
import { Expenses } from '../../../../../utils/schema'
import { toast } from 'sonner'
import { eq } from 'drizzle-orm'

function ExpenseListTable({expenseList,refreshData}) {

    const deleteExpense=async(expense)=>{
        const result=await db.delete(Expenses)
        .where(eq(Expenses.id,expense.id))
        .returning();
        if(result)
        {   
            toast('Expense Deleted!');
            refreshData();
        }
        
    }

  return (
    <div className='mt-3'>
        <h2 className='font-bold text-lg my-3 '>Latest Expenses</h2>
        <div className='grid grid-cols-4 bg-slate-200 p-2'>
            <h2 className='font-bold'>Name</h2>
            <h2 className='font-bold'>Amount</h2>
            <h2 className='font-bold'>Date</h2>
            <h2 className='font-bold'>Action</h2>
        </div>
        {/* {expenseList.map((expenses,index)=>(
            <div className='grid grid-cols-4 bg-slate-50 p-2'>
            <h2>{expenses.name}</h2>
            <h2>{expenses.amount}</h2>
            <h2>{expenses.createdAt}</h2>
            <h2>
                <Trash className='text-red-600'/>
            </h2>
        </div>
        ))} */}
         {expenseList && expenseList.length > 0 ? (
        expenseList.map((expenses, index) => (
          <div key={index} className='grid grid-cols-4 bg-slate-50 p-2'>
            <h2>{expenses.name}</h2>
            <h2>{expenses.amount}</h2>
            <h2>{expenses.createdAt}</h2>
            <h2>
                <Trash className='text-red-600 cursor-pointer'
                onClick={()=>deleteExpense(expenses)}/>
            </h2>
            {/* Add any action buttons or features here */}
          </div>
        ))
      ) : 
        <div  className='w-full bg-slate-50 rounded-lg
        h-[50px] animate-pulse'>  </div>
      }

    </div>
  )
}

export default ExpenseListTable