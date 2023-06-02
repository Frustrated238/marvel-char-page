import { useHttp } from "../hooks/http.hook";
import CryptoJS from "crypto-js";

const useMarvelService =  () =>  {

	const {request, clearError, process, setProcess} = useHttp();

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=fdee923e849c6e77237bd12a7ec6d600';
	const _baseOffset = 210;
	let charLimit = 9;
	let comicsAmount = 8;
	let descrMaxChar = 180;
	if(window.innerWidth <= 991) {
		charLimit = 6;
		comicsAmount = 6;
		descrMaxChar = 140;
	}
	

	let date = new Date();
	let ts = date.getTime().toString();
	let _hash = CryptoJS.MD5(ts + '178987be82bea167544685353d2089bf3b2d17a1fdee923e849c6e77237bd12a7ec6d600').toString();

	const getAllComics = async (offset = 0) => {
		const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=${comicsAmount}&offset=${offset}&ts=${ts}&${_apiKey}&hash=${_hash}`
		);
		return res.data.results.map(_transformComics);
	};

	const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?&ts=${ts}&${_apiKey}&hash=${_hash}`);
		return _transformComics(res.data.results[0]);
	};

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=${charLimit}&offset=${offset}&ts=${ts}&${_apiKey}&hash=${_hash}`);
		return res.data.results.map(_transformCharacter);
	}

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?&ts=${ts}&${_apiKey}&hash=${_hash}`);
		return _transformCharacter(res.data.results[0]);
	}
	const getCharByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&ts=${ts}&${_apiKey}&hash=${_hash}`);
		if (res.data.total === 0) {
			setProcess('error');
		} else {
			setProcess('confirmed');
		}
		return res.data.results.map(_transformCharacter);
	}

	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description ? `${char.description.slice(0, descrMaxChar)}...` : 'There is no available description.',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			// wiki: char.urls[1].url,
			wiki: 'https://www.marvel.com/characters/'+ char.name,
			comics: char.comics.items
		}
	}

	const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
	};


	return {process, 
			clearError, 
			getAllCharacters, 
			getCharacter, 
			getAllComics, 
			getComic, 
			getCharByName,
			setProcess};

}


export default useMarvelService;