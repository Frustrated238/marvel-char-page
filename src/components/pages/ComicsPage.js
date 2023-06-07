import { Helmet } from "react-helmet";
import AppBanner from '../appBanner/AppBanner';
import ComicsList from "../comicsList/ComicsList";


const ComicsPage = () => {
	return(
		<>
			<Helmet>
				<meta
					name="description"
					content="Page with Marvel comics"
					/>
				<title>Marvel comics</title>
			</Helmet>
			{window.innerWidth <= 575 ? '' : <AppBanner/>}
			<ComicsList/>
		</>
	)
}
export default ComicsPage;