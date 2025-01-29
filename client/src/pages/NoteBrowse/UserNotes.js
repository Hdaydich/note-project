import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { NoteList } from "../../containers/NoteList/NoteList";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
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
  const navigate=useNavigate();

  const auth = useContext(AuthContext);

  const userId = auth.userId;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/notes/user/${userId}`
        );
        setLoadedNotes(responseData.notes);
      } catch (err) {}
    };
    fetchNotes();
  }, [sendRequest, userId]);

  const noteDeletedHandler = deletedNoteId => {
    setLoadedNotes(prevPlaces =>
      prevPlaces.filter(note => note.id  !== deletedNoteId)
    );
  };


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
            // onTextChange={setSearchText}
          />
        </div>
      </div>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && <LoadingSpinner /> }

      {!loadedNotes && (
        <div className={s.div}>
          <span className={s.span}>
            Vous n'avez pas de note, voulez vous en{" "}
            <Link to="/note/new"> créer une </Link>
          </span>
        </div>
      )}
      <div className={s.divList}>
      {!isLoading && loadedNotes &&  <NoteList noteList={loadedNotes}  onDelete={noteDeletedHandler}/>}
      </div>
    </React.Fragment>
  );
};

