import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #ffffff, #f1f1f1);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 3rem;
`;

const Logo = styled.img`
  height: 80px;
  margin-right: 20px;
`;

const Title = styled(Typography)`
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const Dropzone = styled.div`
  border: 2px dashed #00b050;
  padding: 3rem;
  text-align: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #f0f8f4;
    border-color: #0070c0;
  }
`;

const FileInfo = styled(Typography)`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const ActionButton = styled(Button)`
  background-color: #00b050 !important;
  color: white !important;
  padding: 12px 24px;
  border-radius: 8px;
  width: 100%;
  font-size: 1.1rem;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #0070c0 !important;
  }
`;

const QuestionInput = styled(TextField)`
  width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AnswerContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const AnswerTitle = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
`;

const AnswerText = styled(Typography)`
  font-size: 1.2rem;
  white-space: pre-wrap;
  color: #333;
`;

const App = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [documentId, setDocumentId] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData);
      if (response.data.document_id) {
        setDocumentId(response.data.document_id);
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question || !documentId) return alert("Enter a question and upload a file first!");

    const formData = new FormData();
    formData.append("question", question);
    formData.append("filename", documentId);

    try {
      const response = await axios.post("http://localhost:8000/ask/", formData);
      if (response.data.answer) {
        setAnswer(response.data.answer);
      } else {
        alert("Error fetching answer.");
      }
    } catch (error) {
      console.error("Error fetching answer", error);
      alert("Error fetching answer. Please try again.");
    }
  };

  return (
    <Container>
      <Header>
        <Logo src="https://framerusercontent.com/images/pFpeWgK03UT38AQl5d988Epcsc.svg?scale-down-to=512" alt="Planet Logo" />
        <Title variant="h4">PDF Q&A App</Title>
      </Header>

      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        <Typography variant="body1" color="textSecondary">
          Drag & drop a PDF here, or click to select one
        </Typography>
      </Dropzone>

      {file && <FileInfo variant="body1">Selected file: {file.name}</FileInfo>}

      <ButtonGroup>
        <ActionButton variant="contained" onClick={uploadFile} disabled={uploading}>
          {uploading ? <CircularProgress size={24} /> : "Upload PDF"}
        </ActionButton>

        <QuestionInput
          label="Ask a Question"
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <ActionButton variant="contained" onClick={askQuestion}>
          Ask
        </ActionButton>
      </ButtonGroup>

      {answer && (
        <AnswerContainer>
          <AnswerTitle variant="h6">Answer:</AnswerTitle>
          <AnswerText variant="body1">{answer}</AnswerText>
        </AnswerContainer>
      )}
    </Container>
  );
};

export default App;
