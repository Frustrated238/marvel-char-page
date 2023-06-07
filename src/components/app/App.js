import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage= lazy(() => import('../pages/singleComicLayout/SingleComicPage'));
const SingleCharPage = lazy(() => import('../pages/singleCharacterLayout/SingleCharPage'));
const SinglePage = lazy(() => import('../pages/singlePage'));
const SingleCharMobile = lazy(() => import('../pages/singleCharacterLayout/SingleCharMobile'));



const App = () => {
    const screenWidth = window.innerWidth;
    return (    
        <Router>
            <div className="app">
            <AppHeader/>
            <main>               
                    <Suspense fallback={<Spinner/>} > 
                        <Routes>
                            <Route exact path="/" element={<MainPage/>}/>      
                            <Route exact path="/comics" element={<ComicsPage/>}/>
                            <Route exact path="/comics/:id" element={<SinglePage Component={SingleComicPage} dataType='comic'/>}/>
                            <Route exact path="/characters/:id" element={<SinglePage Component={screenWidth > 767 ? SingleCharPage : SingleCharMobile} dataType='character'/>}/>
                            <Route path="*" element={<Page404/>}/>
                         </Routes>
                    </Suspense>
            </main>
        </div>
        </Router>   
    )

}


export default App;