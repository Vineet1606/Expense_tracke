"use client";
import React, { useEffect, useState } from "react";

// import budgets from '../../budgets/page'
import { useUser } from "@clerk/nextjs";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "../../../../../utils/dbConfig";
import { Expenses, budgets } from "../../../../../utils/schema";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "../../../../../components/ui/button";
import { PenBox, Trash, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import EditBudget from "../_components/EditBudget";

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [expenseList, setExpensesList] = useState();
  const route = useRouter();
  useEffect(() => {
    // console.log(params)
    // console.log("User:", user.primaryEmailAddress?.emailAddress);
    // console.log("Params ID:", params.id);

    user && getBudgetInfo();
  }, [user]);

  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(budgets)
      .leftJoin(Expenses, eq(budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(budgets.createdBy, user.primaryEmailAddress?.emailAddress),
          eq(budgets.id, params.id)
        )
      )
      .where(eq(budgets.createdBy, user.primaryEmailAddress?.emailAddress))
      .where(eq(budgets.id, params.id))
      .groupBy(budgets.id);

    setBudgetInfo(result[0]);
    getExpensesList();
    // console.log(result);
  };

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
    // console.log(result);
  };

  const deleteBudget = async () => {
    const deleteExpenseResult = await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();

    if (deleteExpenseResult) {
      const reuslt = await db
        .delete(budgets)
        .where(eq(budgets.id, params.id))
        .returning();
    }
    toast("Budget Deleted!");
    route.replace("/dashboard/budgets");
    // console.log(result);
  };

  const router = useRouter();

  const handleBack = () => {
    router.back(); // Navigate one step back in history
  };
  return (
    <div className="p-9">
      <h2 className="text-2xl font-bold flex justify-between items-center">
      <div className="flex gap-3">
        <div onClick={handleBack} className="cursor-pointer">
          <ArrowLeft />
        </div>
        My Expenses
      </div>
        <div className="flex gap-2 items-center">
          <EditBudget budgetInfo={budgetInfo}
          refreshData={()=>getBudgetInfo()}/>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive">
                <Trash />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with current Expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200
          rounded-lg animate-pulse"
          ></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-lg">Latest Expenses</h2>
        <ExpenseListTable
          expenseList={expenseList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
