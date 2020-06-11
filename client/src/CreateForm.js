import React, { useState, useContext, useEffect, useRef } from "react";
import { MyTestStore } from "./App";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
// import styled from "styled-components";
import axios from "axios";

import { Clear } from "@material-ui/icons";

// import { withRouter } from 'react-router-dom';
// import './style.css';

// const MainContainer = styled.main`
//   grid-area: main;
//   display: grid;
//   grid-template-columns: 1fr;
//   margin: 0;
// `;

// const MovieForm = styled.form`
//   display: grid;
//   grid-template-columns: 1fr 25%;
//   height: 100vh;
//   width: 100%;
//   margin: 0;
// `;

// const MovieInfo = styled.div`
//   padding: 80px;
// `;

// const MoviePosters = styled.div`
//   background: lightgrey;
//   padding: 80px 40px;
// `;

// const HideMe = styled.div`
//   height: 470px;
//   overflow-y: auto;
//   overflow-x: hidden;
//   background: gainsboro;
//   border: 1px solid lavender;
// `;

const movieData = { title: "", date: "", synopsis: "", vID: "", trailer: "" };
const AppContext = React.createContext();

const Create = () => {
  const { user, verified, setState } = useContext(MyTestStore);

  const Submit = props => {
    const { files, onSubmit } = props;
    const { movie, setShowLoading } = useContext(AppContext);
    const handleSubmit = () => {
      console.log({ movie });
      console.log(files.map(f => f.meta));
      const apiUrl = "http://localhost:5000/api/movies/";
      const headers = "multipart/form-data";
      const formData = new FormData();
      formData.set("title", movie.title);
      formData.set("date", movie.date);
      formData.set("synopsis", movie.synopsis);
      formData.set("vID", movie.vID);
      formData.set("trailer", movie.trailer);

      files.map(fileItem => formData.append("poster", fileItem.file));

      console.log(Array.from(formData));
      axios
        .post(apiUrl, formData, headers)
        .then(result => {
          setShowLoading(false);
          console.log(result);
          props.history.push("/show/" + result.data.movie._id);
        })
        .catch(error => setShowLoading(false));
      onSubmit();
    };
    return (
      <div className="dzu-submitButtonContainer">
        <button onClick={handleSubmit} className="dzu-submitButton">
          Submit
        </button>
      </div>
    );
  };

  const Preview = ({ meta, fileWithMeta }) => {
    const { previewUrl, name, status } = meta;
    const { uploadPercentage, setUploadPercentage } = useContext(AppContext);
    const timeout = useRef();
    console.log({ status });
    useEffect(() => {
      const time = 10000;
      if (uploadPercentage < 100) {
        timeout.current = setTimeout(() => {
          setUploadPercentage(uploadPercentage => uploadPercentage + 1);
        }, time / 1000);
      }

      return () => clearTimeout(timeout.current);
    }, [uploadPercentage]);

    return (
      <div className="dzu-previewContainer">
        <img
          class="dzu-previewImage"
          src={previewUrl}
          alt={name}
          title={name}
        />
        <progress max="100" value={uploadPercentage} />
        {uploadPercentage === 100 ? (
          <Clear onClick={fileWithMeta.remove} />
        ) : (
          ""
        )}
      </div>
    );
  };

  const Layout = ({
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
    extra: { maxFiles }
  }) => {
    return (
      <div>
        <div>
          {submitButton}
          <div {...dropzoneProps}>
            {previews}
            {files.length < maxFiles && input}
          </div>
        </div>
      </div>
    );
  };

  const MyUploader = () => {
    const AppContext = React.createContext();

    const [movie, setMovie] = useState(movieData);
    const [showLoading, setShowLoading] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const values = {
      movie,
      setMovie,
      showLoading,
      setShowLoading,
      uploadPercentage,
      setUploadPercentage
    };

    return (
      <AppContext.Provider value={values}>
        <Dropzone
          autoUpload={false}
          SubmitButtonComponent={Submit}
          PreviewComponent={Preview}
          LayoutComponent={Layout}
          onSubmit={() => {
            console.log("After submit?");
          }}
          inputContent="Drop Files (Custom Layout)"
        />
      </AppContext.Provider>
    );
  };
  const { movie, setMovie, showLoading } = useContext(AppContext);

  return (
    <>
      <MainContainer>
        <MovieForm>
          <MovieInfo>
            {showLoading && <span className="sr-only">Loading...</span>}
            <h2 className="title">Add Movie</h2>
            <div className="wrapper">
              <span>Title</span>
              <input
                className="no-outline"
                type="text"
                name="title"
                defaultValue={movie.title}
                onChange={e => setMovie({ ...movie, title: e.target.value })}
                placeholder="Film Title"
              />
            </div>

            <div className="wrapper">
              <span>Date</span>
              <input
                className="no-outline"
                type="date"
                name="date"
                defaultValue={movie.date}
                onChange={e => setMovie({ ...movie, date: e.target.value })}
              />
            </div>

            <div className="wrapper">
              <span>Synopsis</span>
              <textarea
                className="no-outline"
                type="text"
                name="synopsis"
                defaultValue={movie.synopsis}
                onChange={e => setMovie({ ...movie, synopsis: e.target.value })}
                placeholder="Synopsis"
              />
            </div>

            <div className="wrapper">
              <span>Movie ID</span>
              <input
                className="no-outline"
                type="text"
                name="vID"
                defaultValue={movie.id}
                onChange={e => setMovie({ ...movie, vID: e.target.value })}
                placeholder="Veezi Film ID"
              />
            </div>

            <div className="wrapper">
              <span>Trailer</span>
              <input
                className="no-outline"
                type="text"
                name="trailer"
                defaultValue={movie.trailer}
                onChange={e => setMovie({ ...movie, trailer: e.target.value })}
                placeholder="Trailer URL"
              />
            </div>
          </MovieInfo>

          <MoviePosters>
            <MyUploader />
          </MoviePosters>
        </MovieForm>
      </MainContainer>
    </>
  );
};

export default Create;
