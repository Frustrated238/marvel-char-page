import './comicsList.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';


const setContent = (process, Component, newItemLoading) => {
	switch(process) {
		case 'waiting':
			return <Spinner/>;
			break;
		case 'loading': 
			return newItemLoading ? <Component/> : <Spinner/>;
			break;
		case 'confirmed': 
			return <Component/>;
			break;
		case 'error': 
			return <ErrorMessage/>;
			break;
		default: 
			throw new Error('Unexpected process state')
	} 
}

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(100);
    const [comicsEnded, setComicsEnded] = useState(false);


    const {loading, error, getAllComics, process, setProcess} =  useMarvelService();

    useEffect(() =>{
        onRequest(offset, true);
    }, [])
   
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(()=> setProcess('confirmed'));
    }


    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li key={i} className="comics__item">
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
        return (
                <ul className="comics__grid">
                    {items}
                </ul>
        )
    }




    return (
        <div className="comics__list">
            {setContent(process, () =>  renderItems(comicsList), newItemLoading)}
            <button 
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;