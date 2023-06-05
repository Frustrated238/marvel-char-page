import { useState, useEffect } from 'react';
import setContent from '../../utils/setContent';

import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    
    const [char, setChar] = useState({});

    const {getCharacter, clearError, process, setProcess} =  useMarvelService();

    useEffect(() => {
        updateChar();
        // const timerId = setInterval(updateChar, 120000);
        // return () => { clearInterval(timerId) }
    }, [])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded)
            .then(()=> setProcess('confirmed'));
    }

    return (
        <div className="randomchar">
            {setContent(process, View , char)}
            <div className="randomchar__static">
            <div className='randomchar__title-mobile'>Random character for today</div>
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, wiki} = data;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} style={imgStyle} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name.replace(/\([^)]*\)/g, '')}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={wiki} className="button button__main">
                        <div className="inner">Wiki</div>
                    </a>
                    {/* <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a> */}
                </div>
            </div>
         </div>
    )
}

export default RandomChar;