import StartupForm from "./components/StartupForm";

import Header from "./components/Header";
import PostDetail from "./pages/PostDetails";
import CategoryPosts from "./pages/CategoryPosts";

import PostList from "./pages/PostList";
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
// import Summarize from "./components/Summarize"
function App() {
  return (
    <div className="App">
      <Router>
      <Header/>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<PostDetail/>} />
          <Route path="/posts/category/:name" element={<CategoryPosts/>} />
          <Route path="/form" element={<StartupForm />} />

÷        </Routes>
      </Router>
    </div>
  );
}

export default App;
