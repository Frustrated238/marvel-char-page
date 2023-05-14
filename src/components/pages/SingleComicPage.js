import { useParams , Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import setContent from '../../utils/setContent';

import useMarvelService from '../../services/MarvelService';

import './singleComicPage.scss';

const SingleComicPage = () => {
	const {comicId} = useParams();

	const [comic, setComic] = useState(null);
	const { getComic, clearError, process, setProcess} =  useMarvelService();

	useEffect(() => {
        updateComic();
    }, [comicId])

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
			.then(()=> setProcess('confirmed'));
    }

    const onComicLoaded = (comic) => {
        setComic(comic);     
    }

	return (
		<>
 			{setContent(process, View , comic)}
		</>
    )
}


const View = ({data}) => {
	const {title, description, pageCount, thumbnail, language, price} = data;
	
	return (
        <div className="single-comic">
			<Helmet>
				<meta
					name="description"
					content={`${title} comics book`}
					/>
				<title>{title}</title>
			</Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">Pages: {pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">Price: {price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
	)
}

export default SingleComicPage;