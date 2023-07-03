"use client";
import { useState, useEffect } from 'react';
import supabase from '../../lib/supabaseClient';

const ExpenseForm = () => {
    const [groupName, setGroupName] = useState('');
    const [groupId, setGroupId] = useState(0);
    const [title, setTitle] = useState('');
    const [paidByUserId, setPaidByUserId] = useState('');
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState([]);
    const [amount, setAmount] = useState({});
    const [isChecked, setIsChecked] = useState({})
    const [split, setSplit] = useState({[users.userId]: false})
    const [comment, setComment] = useState('')

    const toggleCheckbox = (userId) => {
        setIsChecked({
          ...isChecked,
          [userId]: !isChecked[userId]
        })
    }

    const handleAmountChange = (userId, value) => {
        setAmount({
          ...amount,
          [userId]: value
        })
    }
    
    const handleSplitChange = (userId) => {
        setSplit({
            ...split,
            [userId]: !split[userId]
        });
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }


    const handlePaidByChange = (event) => {
        setPaidByUserId(event.target.value)
    }

    const handleTotalChange = (event) => {
        setTotal(event.target.value)
    }

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        // Speichere den Titel, den gezahlten Benutzer und die Gesamtsumme in der Datenbank
        const { data: transactionData, error: transactionError } = await supabase
            .from('transactions')
            .insert([{ title: title, payedBy: paidByUserId, total: total, groupId: groupId, createdAt: new Date(), comment: comment }])
        console.log("this is the comment: " + comment)
        if (transactionError) {
            console.error(transactionError)
        } else {
            console.log('Titel, gezahlter Benutzer und Gesamtsumme wurden erfolgreich gespeichert:', transactionData);
            // Fetch the latest transaction for the user
            const { data: latestTransactionData, error: latestTransactionError } = await supabase
                .from('transactions')
                .select('transactionId')
                .eq('payedBy', paidByUserId)
                .order('createdAt', { ascending: false })
                .limit(1)
    
            if (latestTransactionError) {
                console.error(latestTransactionError);
            } else {
                const transactionId = latestTransactionData[0].transactionId;
            
                let countSplitUsers = 0
                users.map(user => {
                    if (isChecked[user.userId] && split[user.userId]) {
                        countSplitUsers++
                    }
                })
            
                let remainingAmount = total
            
                const userTransactionRows = users
                    .filter(user => isChecked[user.userId] && !split[user.userId])
                    .map(user => {
                        remainingAmount -= amount[user.userId]
                        return {
                            transactionId: transactionId, 
                            userId: user.userId, 
                            amount: amount[user.userId]*-1 || 0
                        }
                    })
            
                const splitUserTransactionRows = users
                    .filter(user => isChecked[user.userId] && split[user.userId])
                    .map(user => {
                        return {
                            transactionId: transactionId, 
                            userId: user.userId, 
                            amount: remainingAmount/countSplitUsers*-1 || 0
                        }
                    })
            
                const allTransactions = [
                    { transactionId, userId: paidByUserId, amount: total },
                    ...userTransactionRows,
                    ...splitUserTransactionRows
                ];
            
                const { data: userTransactionRowData, error: userTransactionRowError } = await supabase
                    .from('userTransaction')
                    .insert(allTransactions)
            
                if (userTransactionRowError) {
                    console.error(userTransactionRowError)
                    return
                }
            
                console.log('Die User auf die das Geld aufgeteilt wurde wurden erfolgreich gespeichert:', userTransactionRowData);
            }
            
    
            // Zurücksetzen der Formularfelder nach dem Speichern
            setTitle('')
            setPaidByUserId('')
            setTotal(0)
            setComment('')
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            // Fetch group name
            const { data: groupData, error: groupError } = await supabase.from('groups').select('groupname, groupId').single();
            if (groupError) {
                console.error(groupError);
            } else {
                setGroupName(groupData.groupname);
                setGroupId(groupData.groupId);
            }

            // Fetch users
            const { data: usersData, error: usersError } = await supabase.from('users').select('userId, username');
            if (usersError) {
                console.error(usersError);
            } else {
                setUsers(usersData);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="container-table">
                <h2>{groupName}</h2>
                <form onSubmit={handleFormSubmit}>
                    <table className="table">
                        <tbody>
                            <tr className="table-row">
                                <td className="table-cell">Title:</td>
                                <td className="table-cell-form">
                                    <input type="text" value={title} onChange={handleTitleChange} />
                                </td>
                            </tr>
                            <tr className="table-row">
                                <td className="table-cell">Who paid?</td>
                                <td className="table-cell-form">
                                    <select value={paidByUserId} onChange={handlePaidByChange}>
                                        <option value="">Select user</option>
                                        {users.map((user) => (
                                            <option key={user.userId} value={user.userId}>
                                                {user.username}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr className="table-row">
                                <td className="table-cell">Total:</td>
                                <td className="table-cell-form">
                                    <input type="number" step=".01" value={total} onChange={handleTotalChange} />
                                    <span> €</span>
                                </td>
                            </tr>
                            {users.map((user) => (
                                <tr className="table-row" key={user.userId}>
                                    <td className="table-cell">
                                        <input 
                                            type="checkbox" 
                                            checked={isChecked[user.userId] || false}
                                            onChange={() => toggleCheckbox(user.userId)}
                                        />
                                        {user.username}:
                                        <input 
                                            type="number" 
                                            value={amount[user.userId] || ''}
                                            disabled={!isChecked[user.userId] || split[user.userId]}
                                            onChange={(e) => handleAmountChange(user.userId, e.target.value)}
                                        />
                                        <span> €</span>
                                        <span> or </span>
                                        <input type="checkbox" 
                                            disabled={!isChecked[user.userId]} 
                                            checked={split[user.userId] || false} 
                                            onChange={() => handleSplitChange(user.userId)}/>
                                        <span> split the rest</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <span>Comment:</span>
                    <textarea value={comment} onChange={handleCommentChange}></textarea>
                    <div className="button-container">
                        <button type="submit" className="add-user-button">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;