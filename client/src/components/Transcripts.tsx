import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader
} from 'semantic-ui-react'

import { deletetranscript, gettranscripts } from '../api/transcripts-api'
import Auth from '../auth/Auth'
import { Transcript } from '../types/Transcript'

interface transcriptsProps {
  auth: Auth
  history: History
}

interface transcriptsState {
  transcripts: Transcript[]
  newtranscriptName: string
  loadingTranscripts: boolean
}

export class Transcripts extends React.PureComponent<transcriptsProps, transcriptsState> {
  state: transcriptsState = {
    transcripts: [],
    newtranscriptName: '',
    loadingTranscripts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newtranscriptName: event.target.value })
  }

  onEditButtonClick = (transcriptId: string) => {
    this.props.history.push(`/transcripts/${transcriptId}/edit`)
  }

  ontranscriptDelete = async (transcriptId: string) => {
    try {
      await deletetranscript(this.props.auth.getIdToken(), transcriptId)
      this.setState({
        transcripts: this.state.transcripts.filter(transcript => transcript.transcriptId !== transcriptId)
      })
    } catch {
      alert('transcript deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const transcripts = await gettranscripts(this.props.auth.getIdToken())
      this.setState({
        transcripts,
        loadingTranscripts: false
      })
    } catch (e) {
      alert(`Failed to fetch transcripts: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">transcripts</Header>

        {this.renderCreatetranscriptInput()}

        {this.renderTranscripts()}
      </div>
    )
  }

  renderCreatetranscriptInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task'
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTranscripts() {
    if (this.state.loadingTranscripts) {
      return this.renderLoading()
    }
    return this.renderTranscriptsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading transcripts
        </Loader>
      </Grid.Row>
    )
  }

  renderTranscriptsList() {
    return (
      <Grid padded>
        {this.state.transcripts.map((transcript, pos) => {
          return (
            <Grid.Row key={transcript.transcriptId}>
              <Grid.Column width={10} verticalAlign="middle">
                {transcript.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {transcript.text}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {transcript.status}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.ontranscriptDelete(transcript.transcriptId)}>
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
