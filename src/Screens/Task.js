import React, { useContext, useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, Modal, TextField, Snackbar, Alert } from '@mui/material';
import { createTaskApi, deleteTaskApi, getAllTaskApi, updateTaskApi, updateTaskTypeApi } from '../APIs/TaskApi'; // Update with your API functions
import { dayConvert } from '../components/TimeConvert';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TaskManagement = () => {
    const [tasks, setTasks] = useState({ toComplete: [], inProcess: [], done: [] });
    const [refresh, setRefresh] = useState(false);
    const [sortOption, setSortOption] = useState('recent');
    // delete task state
    const [deleteMessage, setDeleteMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    // edit task state
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    const getTaskData = async (sorted) => {
        const response = await getAllTaskApi(sorted);
        setTasks(response?.tasks);
    };

    const handleSortChange = async (event) => {
        setSortOption(event.target.value);
        // Call a function to fetch data based on the selected sort option
        const sorted = event.target.value !== "recent" ? 0 : 1;
        const response = await getAllTaskApi(sorted);
        setTasks(response?.tasks);
    };

    useEffect(() => {
        getTaskData(1);
    }, [refresh]);

    const handleCreateTask = async () => {
        await createTaskApi(newTaskTitle, newTaskDescription);
        setRefresh(!refresh);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setOpenAddTaskModal(false);
    };

    const handleUpdateTask = async () => {
        await updateTaskApi(editTaskId, editTaskTitle, editTaskDescription);
        setRefresh(!refresh);
        setEditTaskId(null);
        setEditTaskTitle('');
        setEditTaskDescription('');
        setOpenAddTaskModal(false);
    };

    const handleDeleteTask = async (taskId) => {
        const response = await deleteTaskApi(taskId);
        setDeleteMessage(response.message);
        setOpenSnackbar(true);
        setRefresh(!refresh);
    };

    const handleOpenModal = (task) => {
        if (task) {
            setEditTaskId(task._id);
            setEditTaskTitle(task.title);
            setEditTaskDescription(task.description);
        } else {
            setEditTaskId(null);
            setNewTaskTitle('');
            setNewTaskDescription('');
        }
        setOpenAddTaskModal(true);
    };

    const handleCloseModal = () => {
        setEditTaskId(null);
        setEditTaskTitle('');
        setEditTaskDescription('');
        setNewTaskTitle('');
        setNewTaskDescription('');
        setOpenAddTaskModal(false);
    };

    const handleDragEnd = async (result) => {
        const { destination, draggableId } = result;

        // if dropped outside the list
        if (!destination)
            return;

        // Update the taskType in the backend via API call
        const newTaskType = destination.droppableId === 'toComplete' ? 'toComplete' :
            destination.droppableId === 'inProcess' ? 'inProcess' : 'done';

        await updateTaskTypeApi(draggableId, newTaskType);
        setRefresh(!refresh)
    };

    const renderTasks = (tasksArrayId, tasksArray) => {
        return (
            <DraggableList droppableId={tasksArrayId} tasks={tasksArray} />
        );
    };

    const DraggableList = ({ droppableId, tasks }) => (
        <Droppable droppableId={droppableId} key={droppableId}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks?.map((item, index) => (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                            {(provided) => (
                                <Paper
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    sx={{ padding: 2, marginBottom: 2 }}
                                >
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography variant="body1">{item.description}</Typography>
                                    <Typography variant="caption">Created at: {dayConvert(item.createdAt)}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenModal(item)}>Edit</Button>
                                        <Button variant="contained" color="error" onClick={() => handleDeleteTask(item._id)}>Delete</Button>
                                        <Button variant="contained">View Details</Button>
                                    </Box>
                                </Paper>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
    

    return (
        <Container sx={{ marginTop: 4 }}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4">Task Management</Typography>
                            <FormControl variant="outlined" sx={{ minWidth: 120, marginLeft: 2 }}>
                                <InputLabel id="sort-by-label">Sort By</InputLabel>
                                <Select
                                    labelId="sort-by-label"
                                    id="sort-by-select"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                    label="Sort By"
                                >
                                    <MenuItem value="recent">Recent</MenuItem>
                                    <MenuItem value="oldest">Oldest</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>Add Task</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5" align="center">TODO</Typography>
                                {renderTasks('toComplete', tasks?.toComplete)}
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5" align="center">IN PROGRESS</Typography>
                                {renderTasks('inProcess', tasks?.inProcess)}
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h5" align="center">DONE</Typography>
                                {renderTasks('done', tasks?.done)}
                        </Paper>
                    </Grid>
                </Grid>
            </DragDropContext>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {deleteMessage}
                </Alert>
            </Snackbar>


            <Modal
                open={openAddTaskModal}
                onClose={handleCloseModal}
                aria-labelledby={editTaskId ? "edit-task-title" : "add-task-title"}
                aria-describedby={editTaskId ? "edit-task-description" : "add-task-description"}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id={editTaskId ? "edit-task-title" : "add-task-title"} variant="h6" component="h2">
                        {editTaskId ? 'Edit Task' : 'Add Task'}
                    </Typography>
                    <TextField
                        fullWidth
                        id={editTaskId ? "edit-task-title-input" : "new-task-title-input"}
                        name={editTaskId ? "editTaskTitle" : "newTaskTitle"}
                        label="Title"
                        value={editTaskId ? editTaskTitle : newTaskTitle}
                        onChange={(e) => editTaskId ? setEditTaskTitle(e.target.value) : setNewTaskTitle(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        id={editTaskId ? "edit-task-description-input" : "new-task-description-input"}
                        name={editTaskId ? "editTaskDescription" : "newTaskDescription"}
                        label="Description"
                        multiline
                        rows={4}
                        value={editTaskId ? editTaskDescription : newTaskDescription}
                        onChange={(e) => editTaskId ? setEditTaskDescription(e.target.value) : setNewTaskDescription(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" onClick={handleCloseModal} sx={{ mr: 2 }}>Cancel</Button>
                        {editTaskId ?
                            <Button variant="contained" color="primary" onClick={handleUpdateTask}>Update</Button>
                            :
                            <Button variant="contained" color="primary" onClick={handleCreateTask}>Create</Button>
                        }
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default TaskManagement;
