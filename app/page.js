import PersonOverview from './personOverview.client.js';
import ExpenseList from './expenseList.client.js';


const HomePage = () => {
  return (
    <div className="container">
      <div className="container-table">
        <PersonOverview />
        <ExpenseList />
      </div>
    </div>
  );
};

export default HomePage;
