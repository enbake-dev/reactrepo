import React, { Component } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'
import config from 'config';
import { authHeader } from '../_helpers';

class QuotaManagement extends Component {
  constructor(props) {
    super(props)

    this.state={
      data:{},
      loader:false
    }
  }
  componentDidMount(){
    //this.getData()
  }
  getData(){
    axios.get(`${config.apiUrl}api/v1/users/business_get_quota/`,{headers:   authHeader() })
    .then((response) => {
        this.setState({
          data: response.data,
          loader:false
      })
    })
    .catch((error) => {
        console.log(error)
    })
  }

  render() {
    const {data, loader} = this.state;
    return (
     <div>
        {
          loader?
            (<p>Loading....</p>)
          :
          (<Dashboard/>)
        }
     </div>
    )
  }
}

export default QuotaManagement
