import React, { useState, useContext, useEffect, useRef } from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import axios from 'axios';

import {
  Clear
} from "@material-ui/icons";

const movieData = { title: "" };

const AppContext = React.createContext();

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
    
    
    files.map(fileItem => formData.append("poster", fileItem.file));

    console.log(Array.from(formData));
    axios.post(apiUrl, formData, headers)
    .then((result) => {
      setShowLoading(false);
      console.log(result);
      props.history.push('/show/' + result.data.movie._id)
    }).catch((error) => setShowLoading(false));
    // allFiles.forEach(f => f.remove());
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
  const { previewUrl, name, status } = meta
  const { uploadPercentage, setUploadPercentage} = useContext(AppContext);
  const timeout = useRef()
  console.log({status});
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
      <img class="dzu-previewImage" src={previewUrl} alt={name} title={name}></img>
      <progress max="100" value={uploadPercentage}></progress>
      {uploadPercentage === 100 ? (
      <Clear onClick={fileWithMeta.remove} />
      ) : ('')}
    </div>
  )
}


const Layout = ({
  input,
  previews,
  submitButton,
  dropzoneProps,
  files,
  extra: { maxFiles }
}) => {
  const { movie, setMovie } = useContext(AppContext);

  return (
    <div>
      <div>
        <input
          type="text"
          name="title"
          onChange={e => setMovie({ ...movie, title: e.target.value })}
          defaultValue={movie.title}
        />
      </div>
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

const CustomLayout = () => {

  // const handleSubmit = (files, allFiles) => {
  //   console.log({ movie });
  //   console.log(files.map(f => f.meta));
  //   allFiles.forEach(f => f.remove());
  // };

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

export default CustomLayout;
