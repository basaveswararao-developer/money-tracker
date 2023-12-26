import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name,setName] = useState('');
  const [datetime,setDatetime] = useState('');
  const [description,setDescription] = useState('');
  const [transactions,setTransactions] = useState([]);

  useEffect(()=>{
    getTransactions().then(setTransactions);
  },[])

  async  function getTransactions(){
    const url = process.env.REACT_APP_API_URL + 'transactions';
    const response=await fetch(url);
    return await response.json();
  }

  async function addNewTransaction(event) {
    event.preventDefault();
    const url = process.env.REACT_APP_API_URL + 'transactions';
    const price = name.split(' ')[0];
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          price,
          name: name.substring(price.length + 1),
          description,
          datetime,
        }),
      });
  
      const json = await response.json();
      // Update transactions with the new transaction
      setTransactions(prevTransactions => [...prevTransactions, json]);
      
      setName('');
      setDatetime('');
      setDescription('');
      console.log('result', json);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }
  
  let balance =0;
  for(const transaction of transactions){
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder='+200 new samsung tv'
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={event => setDatetime(event.target.value)}
          />
        </div>
        <div className='description'>
          <input
            type="text"
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder='Description'
          />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                {console.log(transaction.price)}
                <div
                  className={'price' + (transaction.price < 0 ? ' red' : ' green')}
                >
                  {transaction.price}
                </div>
                <div className="datetime">2023-12-22 15:45</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
