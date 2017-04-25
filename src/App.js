import React from 'react';
import ActionBar from './ActionBar.js'
import NoteList from './NoteList.js'
import NoteView from './NoteView.js'
import ErrorBox from './ErrorBox.js'
// import R from 'ramda';
import api from './api';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.currentTimeouts = {}

    this.state = {
      notes: [],
      selectedNoteId: -1,
      error: false
    };

    this.addNote = this.addNote.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
    this.selectNote = this.selectNote.bind(this)
    this.modifyNote = this.modifyNote.bind(this)
    this.updateNote = this.updateNote.bind(this)
  }

  componentDidMount() {
    api.notes.all().then(notes => this.setState((oldState) => ({
      selectedNoteId: Math.max(...notes.map(note => note.id)),
      notes: notes
    })))
  }

  refresh() {
    api.notes.all().then(notes => this.setState((oldState) => ({
      notes: notes
    })))
  }

  selectNote(noteId) {
    this.setState((oldState) => ({
      selectedNoteId: noteId
    }))
  }

  addNote() {
    const newNote = {
      id: Math.max(...this.state.notes.map(note => note.id), -1) + 1,
      createdAt: new Date().getTime(),
      body: 'Write your note here',
      title: 'New note'
    }

    this.setState((oldState) => ({
      notes: oldState.notes.concat(newNote),
      selectedNoteId: newNote.id
    }))

    api.notes.create(newNote).then(response => !response.ok && (this.handleError('Error while adding note') || this.refresh()))
  }

  deleteNote(id) {
    this.setState((oldState) => {
      const newNotes = oldState.notes.filter(note => note.id !== id)
      const selectedId = oldState.selectedNoteId === id ? Math.max(...newNotes.map(note => note.id)) : oldState.selectedNoteId
      return {
        notes: newNotes,
        selectedNoteId: selectedId
      }
    })
    api.notes.delete(id).then(response =>  !response.ok && (this.handleError('Error while deleting note') || this.refresh()))
  }

  saveNote(noteId, changelist) {
    changelist.status = 'Saving...'
    this.updateNote(noteId, changelist)

    const noteToSave = {
      ...changelist
    }
    delete noteToSave.status

    api.notes.update(noteId, noteToSave).then(response => {
      noteToSave.status = 'Saved.'
      this.updateNote(noteId, noteToSave)
      !response.ok && (this.handleError('Error while updating note') || this.refresh())
    })
  }

  updateNote(noteId, changelist) {
    this.setState((oldState) => {
      const newNotes = oldState.notes.map(note => note.id === noteId ? { ...note, ...changelist } : note)
      return {
        ...oldState,
        notes: newNotes
      }
    })
  }

  modifyNote(noteId, changelist) {
    if (this.currentTimeouts[noteId]) {
      window.clearTimeout(this.currentTimeouts[noteId])
    }
    this.updateNote(noteId, changelist)
    this.currentTimeouts[noteId] = setTimeout(() => this.saveNote(noteId, changelist), 2000)
  }

  handleError(error) {
    if(this.currentTimeouts.error){
      window.clearTimeout(this.currentTimeouts.error)
    }
    this.setState((oldState) => ({error: error}))
    this.currentTimeouts.error = setTimeout(() => this.setState((oldState => ({error: false}))), 3000)
  }


  render() {
    const {
      notes,
      selectedNoteId
    } = this.state

    const selectedNote =  notes.find(note => note.id === selectedNoteId)

    return (
      <div className="app-container">
        { this.state.error && <ErrorBox error={this.state.error} /> }
        <ActionBar onAdd={this.addNote} />
        <NoteList notes={notes} onSelect={this.selectNote} selectedNoteId={selectedNoteId} />
        <NoteView note={selectedNote} onModify={this.modifyNote} onDelete={this.deleteNote} />
      </div>
    );
  }
}