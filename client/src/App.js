// import logo from './logo.svg';
// import './App.css';
// import React from 'react';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';
import Profile from './Components/Profile';

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (jwtToken) => {
    // Save the JWT token in local storage or state
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
  };

  return (
    <div className="App">
      {!token ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <SignupForm/>
        </>
      ) : (
        <Profile token={token} />
      )}
    </div>
  );
}

export default App;

