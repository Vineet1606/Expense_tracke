"use Client"
import React, { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { PenBox } from "lucide-react";
import EmojiPicker from 'emoji-picker-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Input } from "../../../../../components/ui/input";
import { budgets } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "../../../../../utils/dbConfig";
function EditBudget({budgetInfo,refreshData}) {

    const [emojiIcon,setEmojiIcon]=useState(budgetInfo?.icon);
  const [opneEmojiPicker,setOpenEmojiPicker]=useState(false);

  const[name,setName]=useState();
  const[amount,setAmount]=useState();
  const{user}=useUser();

  useEffect(()=>{
    if(budgetInfo)
    {
        setEmojiIcon(budgetInfo?.icon)
        setName(budgetInfo?.name)
        setAmount(budgetInfo?.amount)
    }
  },[budgetInfo])
  const onUpdateBudget=async()=>{
    const result= await db.update(budgets).set({
        name:name,
        amount:amount,
        icon:emojiIcon,
    }).where(eq(budgets.id,budgetInfo.id))
    .returning();

    if(result)
    {
        refreshData()
        toast('Budget Updated');
    }

  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <PenBox />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  // size="lg"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!opneEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={opneEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g Home Decor"
                    defaultValue={budgetInfo?.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    placeholder="e.g 5000$"
                    type="number"
                    defaultValue={budgetInfo?.amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full"
              >
                Update Budget
              </Button>
              {/* <Button type="button" variant="secondary">
              Close
            </Button> */}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;
