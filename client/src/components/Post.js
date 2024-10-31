import React, { useState } from 'react';
import styled from 'styled-components';

const Post = ({ post, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(post._id, editContent);
    setIsEditing(false);
  };

  return (
    <PostItem>
      {isEditing ? (
        <EditForm onSubmit={handleEditSubmit}>
          <EditTextarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
          <Buttons>
            <EditButton type="submit">保存</EditButton>
            <EditButton type="button" onClick={() => setIsEditing(false)}>キャンセル</EditButton>
          </Buttons>
        </EditForm>
      ) : (
        <div>
          <p>{post.content}</p>
          <Buttons>
            <EditButton onClick={() => setIsEditing(true)}>編集</EditButton>
            <DeleteButton onClick={() => onDelete(post._id)}>削除</DeleteButton>
          </Buttons>
        </div>
      )}
    </PostItem>
  );
};

const PostItem = styled.li`
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
  list-style: none;
`;


const EditForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const EditTextarea = styled.textarea`
  margin-bottom: 10px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const EditButton = styled.button`
    background-color: #ffc107; /* 黄色の背景 */
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
`;

const DeleteButton = styled.button`
    background-color: #dc3545; /* 赤色の背景 */
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
`;

export default Post;