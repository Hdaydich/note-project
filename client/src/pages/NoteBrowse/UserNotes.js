import React, { useEffect, useState, useContext } from 'react';
import { Header } from '../../components/Header/Header';
import { NoteList } from "../../containers/NoteList/NoteList";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useNavigate } from "react-router-dom";
import s from "./style.module.css";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { AuthContext } from '../../shared/context/auth-context';

export function  UserNotes (){

  const [loadedNotes, setLoadedNotes] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [searchText, setSearchText] = useState("");
  const [searchedNotes, setSearchedNotes] = useState();
  const [noteList, setNoteList] = useState();
  
  const navigate=useNavigate();

  const auth = useContext(AuthContext);

  const userId = auth.userId;

  const noteDeletedHandler = deletedNoteId => {
    setNoteList(prevNotes =>
      prevNotes.filter(note => note.id  !== deletedNoteId)
    );
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/notes/user/${userId}`
        );
        setLoadedNotes(responseData.notes);
        setNoteList(responseData.notes);
      } catch (err) {}
    };
    fetchNotes();
  }, [sendRequest, userId]);

      
    useEffect(() => {
        if(!searchText || searchText == "")
        {
          setNoteList(loadedNotes);
        } 
        else{
          
          setSearchedNotes ( loadedNotes.filter((note) => {
            
            const containsTitle = note.title
              .toUpperCase()
              .includes(searchText.toUpperCase());
            
            const containsContent = note.content
              .toUpperCase()
              .includes(searchText.toUpperCase());
            return containsTitle || containsContent;
          }));

          setNoteList(searchedNotes);
        }
    }, [searchText]);



  return (
    <React.Fragment>
        <Header
        buttonText={"NEW NOTE +"}
        buttonAction={() => navigate("/note/new")}
      ></Header>
      <div className={`row justify-content-center mb-5 ${s.div}`}>
        <div className={`col-sm-12 col-md-4 ${s.div}`}>
          <SearchBar
            placeholder="Search your notes..."
            onTextChange={setSearchText}
          />
        </div>
      </div>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && <LoadingSpinner /> }

      {!noteList && (
        <div className={s.div}>
          <span className={s.span}>
            Vous n'avez pas de note, voulez vous en{" "}
            <Link to="/note/new"> créer une </Link>
          </span>
        </div>
      )}
      <div className={s.divList}>
      {!isLoading && noteList &&  <NoteList noteList={noteList}  onDelete={noteDeletedHandler}/>}
      </div>
    </React.Fragment>
  );
};

