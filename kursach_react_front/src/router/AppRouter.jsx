import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from '../pages/Main';
import About from '../pages/About';
import BookOpinions from '../pages/BookOpinions';
import MyShelf from '../pages/MyShelf';
import UserSignUp from '../pages/UserSignUp';
import UserLogin from '../pages/UserLogin';
import Header from '../components/header';
import Footer from '../components/footer';
import React from "react";

function AppRouter() {
  return (
      <Router>
          <Header />
          <main className="cusmain">
            <Routes>

              <Route path='/welcome/user' element={<UserLogin />} />
              <Route path='/nice_to_meet_you/user' element={<UserSignUp />} />

              <Route path='/my_shelf' element={<MyShelf  />} />

              <Route path='/into_my_shelf/:book_title/opinions' element={<BookOpinions />} />

              <Route path='/where/am/i' element={<About />} />
              <Route path='/shelves' element={<Main />} />

            </Routes>
          </main>
          <Footer />
      </Router>
  );
}

export default AppRouter;
