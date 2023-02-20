import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader
} from 'semantic-ui-react'
import { deleteimage, getimages } from '../api/images-api'
import Auth from '../auth/Auth'
import { Prediction } from '../types/Prediction'

interface PredictionsProps {
  auth: Auth
  history: History
}

interface PredictionsState {
  predictions: Prediction[]
  newpredictionName: string
  loadingpredictions: boolean
}

export class Predictions extends React.PureComponent<PredictionsProps, PredictionsState> {
  state: PredictionsState = {
    predictions: [],
    newpredictionName: '',
    loadingpredictions: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newpredictionName: event.target.value })
  }

  onEditButtonClick = () => {
    this.props.history.push(`/images/add`)
  }

  onPredictionDelete = async (predictionId: string) => {
    try {
      await deleteimage(this.props.auth.getIdToken(), predictionId)
      this.setState({
        predictions: this.state.predictions.filter(prediction => prediction.imageId !== predictionId)
      })
    } catch {
      alert('prediction deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const predictions = await getimages(this.props.auth.getIdToken())
      this.setState({
        predictions,
        loadingpredictions: false
      })
    } catch (e) {
      alert(`Failed to fetch predictions: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">predictions</Header>

        {this.renderCreatePrediction()}

        {this.renderPredictions()}
      </div>
    )
  }

  renderCreatePrediction() {
    return (
      <Button
      icon
      color="blue"
      onClick={() => this.onEditButtonClick()}
    >
      Add Image
      <Icon name="pencil" />
    </Button>
    )
  }

  renderPredictions() {
    if (this.state.loadingpredictions) {
      return this.renderLoading()
    }

    return this.renderPredictionsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading predictions
        </Loader>
      </Grid.Row>
    )
  }

  renderPredictionsList() {
    return (
      <Grid padded>
        {this.state.predictions.map((prediction, pos) => {
          return (
            <Grid.Row key={prediction.imageId}>
              <Grid.Column>
              {prediction.imageUrl && (
                <Image src={prediction.imageUrl} size="small" wrapped />
              )}
              </Grid.Column>
              <Grid.Column width={10} floated="right">
                {prediction.prediction && (
                  prediction.prediction.result.tags.map((tag: any, pos: number) => { 
                    return (
                      <Grid.Row>{tag.tag.en} ({parseFloat(tag.confidence).toFixed(2)+"%"})</Grid.Row>
                    )
                  })
                )}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPredictionDelete(prediction.imageId)}
                >
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

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
