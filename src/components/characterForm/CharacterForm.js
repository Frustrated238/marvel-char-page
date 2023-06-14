import {useState} from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';

import './CharacterForm.scss';

const setContent = (process, char) => {
	switch(process) {
		case 'waiting':
			return null;
		case 'loading': 
			return true;
		case 'confirmed': 
			return <div className="char__search-wrapper">
                <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                    <div className="inner">To page</div>
                </Link>
            </div>;
		case 'error': 
			return <div className="char__search-error">
                         The character was not found. Check the name and try again
                    </div>;
		default: 
			throw new Error('Unexpected process state')
	} 
}



const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const {getCharByName, clearError, process, setProcess} = useMarvelService();

    const onCharLoaded = (char) => {
            if(char.length) {
                setChar(char);
                console.log('setChar');
            } else {
                setProcess('error');
            }
        
    }

    const updateChar = (name) => {
        clearError();
        getCharByName(name)
            .then(onCharLoaded);
    }


    return (
        <div className="char__search-form">
            <Formik
                initialValues = {{
                    charName: ''
                }}
                validationSchema = {Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit = { ({charName}) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={setContent(process, char) === true}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {setContent(process, char)}
        </div>
    )
}



export default CharSearchForm;