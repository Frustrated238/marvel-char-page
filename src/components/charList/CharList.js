import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
// import debounce from 'lodash.debounce';
import {Link} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
	switch(process) {
		case 'waiting':
			return <Spinner/>;
		case 'loading': 
			return newItemLoading ? <Component/> : <Spinner/>;
		case 'confirmed': 
			return <Component/>;
		case 'error': 
			return <ErrorMessage/>;
		default: 
			throw new Error('Unexpected process state')
	} 
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const screenWidth = window.innerWidth;
    let charAmount;
    if (screenWidth <= 575) {
        charAmount = 8;
    } else charAmount = 9;

    const {getAllCharacters, process, setProcess} =  useMarvelService();
 
    useEffect(() =>{
        onRequest(offset, true);
    // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     const handleScroll = debounce(() => {
    //         const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    //         if (scrollTop + clientHeight >= scrollHeight) {
    //             onRequest(offset, false);
    //         }
    //     }, 100); 
    
    //     window.addEventListener('scroll', handleScroll);
    
    //     return () => {
    //       window.removeEventListener('scroll', handleScroll);
    //     //   handleScroll.cancel();
    //     }
    //   }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset, initial ? 9 : charAmount)
            .then(onCharListLoaded)
            .then(()=> setProcess('confirmed'));
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9 && screenWidth > 991) {
            ended = true;
        } else if (newCharList.length < 6 && screenWidth <= 991) {
            ended = true;
        }
        setOffset(offset => {
            if(screenWidth > 766 || screenWidth <= 575){
                return offset + 9;
            } else return offset + 9;
        });
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected')); 
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // const handleScroll = () => {
    //     if (newItemLoading) return;
    //     const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    //     if (scrollTop + clientHeight >= scrollHeight && newItemLoading === false) {
    //       onRequest(offset);
	// 	}
    // }

	// window.addEventListener('scroll', handleScroll);


    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <Link to={screenWidth <= 991 ? `/characters/${item.id}`: null}
                    key={uuidv4()}>
                    <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        if (screenWidth <= 575) {

                        } else {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                    onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
                </Link>

            )
        });

        return (
            <ul className="char__grid">
                {items}
                <li>
                {screenWidth <= 575 ?
                    <button 
                            className=" button__mobile"
                            disabled={newItemLoading}
                            style={{'display': charEnded ? 'none' : 'block'}}
                            onClick={() => onRequest(offset)}>
                            <div className="inner">load more</div>
                    </button> : null }    
                </li>
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () =>  renderItems(charList), newItemLoading)
         // eslint-disable-next-line
    }, [process])

    return (
        <div className="char__list">
            {elements}
            {window.innerWidth > 575 ?
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button> : null } 
        </div>
    )
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;