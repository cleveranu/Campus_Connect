import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Paper, Box, IconButton, Typography } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from "../../../redux/noticeRelated/noticeHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import { GreenButton, ButtonContainer } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import nodata from "../../../assets/nodata.png";

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noticesList, loading, error, response } = useSelector(
    (state) => state.notice
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllNotices(currentUser._id, "Notice"));
    });
  };

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows =
    noticesList &&
    noticesList.length > 0 &&
    noticesList.map((notice) => {
      const date = new Date(notice.date);
      const dateString =
        date.toString() !== "Invalid Date"
          ? date.toISOString().substring(0, 10)
          : "Invalid Date";
      return {
        title: notice.title,
        details: notice.details,
        date: dateString,
        id: notice._id,
      };
    });

  const NoticeButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteHandler(row.id, "Notice")}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
    );
  };

  const actions = [
    {
      icon: <NoteAddIcon color="primary" />,
      name: "Add New Notice",
      action: () => navigate("/Admin/addnotice"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Notices",
      action: () => deleteHandler(currentUser._id, "Notices"),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {Array.isArray(noticesList) && noticesList.length > 0 ? (
            <>
              <TableTemplate
                buttonHaver={NoticeButtonHaver}
                columns={noticeColumns}
                rows={noticeRows}
              />
              <SpeedDialTemplate actions={actions} />
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "300px",
                marginBottom: "16px",
              }}
            >
              <img
                src={nodata}
                alt="No Data"
                style={{ maxWidth: "100%", maxHeight: "225px" }}
              />
              <Typography variant="h5" sx={{ marginTop: "16px" }}>
                No notices found
              </Typography>
              <ButtonContainer sx={{ marginTop: "16px" }}>
                <GreenButton
                  variant="contained"
                  onClick={() => navigate("/Admin/addnotice")}
                >
                  Add Notice
                </GreenButton>
              </ButtonContainer>
            </Box>
          )}
        </Paper>
      )}
    </>
  );
};

export default ShowNotices;
