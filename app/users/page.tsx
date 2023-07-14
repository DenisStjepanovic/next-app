import { createClient } from "@supabase/supabase-js";
import React from "react";

const GoogleData = async () => {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            db: {
                schema: "next_auth",
            },
        }
    )
    const { data, error } = await supabase.from("users").select("name, email")
    // const { data: transactionData, error: transactionError } = await supabase.from('users').insert([{ name: data, payedBy: paidByUserId, total: total, groupId: groupId, createdAt: new Date(), comment: comment }])
    return(
        <div>{JSON.stringify(data)}</div>
    )
}

export default GoogleData