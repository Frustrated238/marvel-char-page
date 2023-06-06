import { Helmet } from "react-helmet";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import CharInfo from "../../charInfo/CharInfo";
import ErrorBoundary from "../../errorBoundary/ErrorBoundary";
import back from '../../../resources/svg/arrow-left-solid.svg'

import './SingleCharPage.scss';

const SingleCharMobile = () => {
	const {id} = useParams();
	return(
		<>
			<Helmet>
				<meta
					name="description"
					content="Marvel information portal"
					/>
				<title>Marvel information portal</title>
			</Helmet>
				<div>
					<ErrorBoundary>
						<Link to="/" className="single-char__back"> 
							<img className="single-char__back__img" src={back} alt="back"/> 
							Go back
						</Link>
						<CharInfo charId={+id}/>
					</ErrorBoundary>
				</div>	
		</>
	)
}

export default SingleCharMobile;