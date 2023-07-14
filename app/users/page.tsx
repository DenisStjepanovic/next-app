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
    return(
        <div>{JSON.stringify(data[0].name)}</div>
    )
}

export default GoogleData