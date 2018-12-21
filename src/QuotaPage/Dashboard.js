import React, { Component } from 'react'
import {
    Container,
    Row,
    Col,
    MDBDataTable,
    Table,
    TableHead,
    TableBody,
    Card,
    CardBody,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Button,
    MDBAlert,
  } from "mdbreact";

import axios from 'axios'
import config from 'config';
import { authHeader } from '../_helpers';

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.normaliseTableData = this.normaliseTableData.bind(this)
    this.onEditQuota = this.onEditQuota.bind(this)
    this.toggle = this.toggle.bind(this)
    
    this.state = {
        edit:{},
        columns:[],
        rows:[],
        data: {},
        users: {},
        loader: true,
        showEditQuota:false,
        editQuota:{},
        modal:false,
        isAdmin:true,
        
    }
}

componentDidMount(){
    this.getData()
    console.log(this.ref)
}
  getData(){
    console.log(`${config.apiUrl}api/v1/users/business_get_quota/`)
    axios.get(`${config.apiUrl}api/v1/users/business_get_quota/`,{headers:   authHeader() })
    .then((response) => {
        this.state.rows = []
        this.setState({
          data: response.data,
          users : response.data.data,
          loader:false
      })
        this.normaliseTableData()
    })
    .catch((error) => {
        console.log(error)
    })
  }

normaliseTableData(){
    let rows =[]
    let tableRowData = {}
    this.userEditDataCol= []
    let editQuota={}
    let columns= [
        {
          label: 'User Name',
          field: 'userName',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Type',
          field: 'type',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Total Quota',
          field: 'totalQuota',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Quota Used',
          field: 'quotaUsed',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Quota Available',
          field: 'quotaAvailable',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Quota Reset Date',
          field: 'quotaResetDate',
          sort: 'asc',
          width: 150
        }
      ]
    Object.values(this.state.data.data).map(user=>{
      console.log(user)
      editQuota[user.id] = user.monthly_quota
        tableRowData = {
            userName: user.username,
            type: user.is_organization_admin?'Admin': 'User',
            totalQuota: <div>
                        <Row id={`edit-${user.id}`} className="d-none">
                            <Col md="8">
                                <input type="text" id={`input-${user.id}`} defaultValue={user.monthly_quota} className="form-control"/>
                            </Col>
                            <Col md="4">
                                <Row>
                                    <Col md="6">
                                    <button onClick={()=>this.onSaveQuota(user.id,user.username)} className="text-success">
                                        <i className="fa fa-check" aria-hidden="true"></i>
                                    </button>    
                                    </Col>
                                    <Col md="6">
                                    <button onClick={()=>this.onCancelQuota(user.id)} className="text-danger">
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </button>   
                                    </Col>
                                </Row>
                            </Col>                            
                        </Row>
                        <div id={`quota-${user.id}`}>
                            <span>{user.monthly_quota}</span>
                            <span className="float-right">
                                <button onClick={()=>this.onEditQuota(user.id)} className="text-primary">
                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                            </span>
                        </div>
            </div>,
            quotaUsed: user.quota_usage_count == null ? 0: user.quota_usage_count ,
            quotaAvailable: user.monthly_quota - user.quota_usage_count,
            quotaResetDate: user.quota_reset_date == null? 'not-define': user.quota_reset_date,
        }
        this.state.rows.push(tableRowData)
        console.log(this.state.rows)
    })
    this.setState({
        columns,
        loader:false,
        editQuota
    })
}
onQuotaChange(e,userId){
    // this.setState({[e.target.name]: e.target.value});
    // console.log(e.target.name)
    console.log(e.target.value)
    let inputEl = document.getElementById(`input-${userId}`)
    console.log(inputEl)
    inputEl.value = 5;
    // this.forceUpdate()
}
onEditQuota(userId,monthly_quota,isAdmin=false){

    if(isAdmin){
        let editQuota = document.getElementById(`admin-edit-${userId}`)
        let showQuota = document.getElementById(`admin-quota-${userId}`)
        editQuota.classList.remove("d-none")
        showQuota.classList.remove("d-block")
        showQuota.classList.add("d-none")
    }
    else{
        let editQuota = document.getElementById(`edit-${userId}`)
        let showQuota = document.getElementById(`quota-${userId}`)
        editQuota.classList.remove("d-none")
        showQuota.classList.remove("d-block")
        showQuota.classList.add("d-none")
    }
   

}
onCancelQuota(userId,isAdmin=false){
    if(isAdmin){
        let editQuota = document.getElementById(`admin-edit-${userId}`)
        let showQuota = document.getElementById(`admin-quota-${userId}`)
        editQuota.classList.remove("d-block")
        showQuota.classList.remove("d-none")
        showQuota.classList.add("d-block")
        editQuota.classList.add("d-none")
    }
    else{
        let editQuota = document.getElementById(`edit-${userId}`)
        let showQuota = document.getElementById(`quota-${userId}`)
        editQuota.classList.remove("d-block")
        showQuota.classList.remove("d-none")
        showQuota.classList.add("d-block")
        editQuota.classList.add("d-none")
    }
    
}
onSaveQuota(userId,userName,type){
    this.setState({loader:true})
    let newQuota =document.getElementById(`${type}-${userId}`).value;
    console.log(newQuota)
    axios.patch(`${config.apiUrl}api/v1/${type}/${userId}/`,{
        username: userName,
        monthly_quota: parseInt(newQuota)
    },{headers:  authHeader() })
    .then((response) => {
      this.getData()
        this.setState({
          loader:false,
          modal:true
      })
      setTimeout(()=>{
        this.setState({
            modal:false
        })
    },2000)
    })
    .catch((error) => {
        console.log(error)
    })
    let editQuota = document.getElementById(`edit-${userId}`)
    let showQuota = document.getElementById(`quota-${userId}`)
}
toggle() {
    this.setState({
      modal: !this.state.modal
    });
}
onEditAdminQuota(userId){

}

onChange = (e,id) => {
  const { editQuota } = this.state
  editQuota[id] = e.target.value
  this.setState({
    editQuota
  })
}

  render() {
      const {columns, rows, loader, isAdmin, data, users} =this.state
    return (
     <Container>
        <Row>
            <Col md="12">
            {loader?
                (<p>Loading....</p>)
            :
                (
                    <div>
                        {isAdmin?
                            (
                                <div>
                                    <Modal
                                        backdrop={false}
                                        isOpen={this.state.modal}
                                        toggle={() => this.toggle()}
                                        >
                                        <ModalBody className="p-0 rounded text-center">
                                            <MDBAlert color="success" className="mb-0 rounded">
-                                                <p>Quota Updated Successfully</p>
-                                           </MDBAlert>
                                        </ModalBody>
                                    </Modal>
                                    <div className="mb-3">
                                        <Card>
                                            <CardBody>
                                            <h2 className="h2-responsive pb-4">Organisations: {data.organisation[0].name}</h2>
                                            <Table fixed bordered >
                                            <TableHead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Total Quota</th>
                                                    <th>Quota Used</th>
                                                    <th>Quota Available</th>
                                                    <th>Quota Reset Date,</th>
                                                </tr>
                                            </TableHead>
                                            <TableBody>
                                                <tr>
                                                    <td>{data.organisation[0].name}</td>
                                                    <td>
                                                    <div>
                                                        <Row id={`admin-edit-${data.organisation[0].id}`} className="d-none">
                                                            <Col md="8">
                                                                <input type="text" id={`organizations-${data.organisation[0].id}`} defaultValue={data.organisation[0].monthly_quota} className="form-control"/>
                                                            </Col>
                                                            <Col md="4">
                                                                <Row>
                                                                    <Col md="6">
                                                                    <button onClick={()=>this.onSaveQuota(data.organisation[0].id,data.organisation[0].username,"organizations")} className="text-success">
                                                                        <i className="fa fa-check" aria-hidden="true"></i>
                                                                    </button>    
                                                                    </Col>
                                                                    <Col md="6">
                                                                    <button onClick={()=>this.onCancelQuota(data.organisation[0].id,true)} className="text-danger">
                                                                        <i className="fa fa-times" aria-hidden="true"></i>
                                                                    </button>   
                                                                    </Col>
                                                                </Row>
                                                            </Col>                            
                                                        </Row>
                                                        <div id={`admin-quota-${data.organisation[0].id}`}>
                                                            <span>{data.organisation[0].monthly_quota}</span>
                                                            <span className="float-right">
                                                                <button onClick={()=>this.onEditQuota(data.organisation[0].id,data.organisation[0].monthly_quota,true)} className="text-primary">
                                                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    </td>
                                                    {/* <td>{data.organisation[0].monthly_quota}<button onClick={()=>this.onEditAdminQuota(data.organisation[0].id)} className="text-primary float-right">
                                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                                </button></td> */}
                                                    <td>{data.organisation[0].quota_usage_count}</td>
                                                    <td>{data.organisation[0].monthly_quota  - data.organisation[0].quota_usage_count}</td>
                                                    <td>{data.organisation[0].quota_reset_date}</td>
                                                </tr>
                                            </TableBody>
                                            </Table>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    <div>
                                 
                                      <table className="table">
                                      <thead>
                                        <tr>
                                          <th>UserName</th>
                                          <th>Type</th>
                                          <th>Total Quota</th>
                                          <th>Quota Used</th>
                                          <th>Quota Available</th>
                                          <th>Quota Reset Date</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.data.map((u,i)=>{
                                          return (<tr key={i}>
                                            <td>{u.username}</td>
                                            <td>{u.is_organization_admin ? 'Admin': 'User'}</td>
                                            <td>
                                              <div>
                                                <Row id={`edit-${u.id}`} className="d-none">
                                                    <Col md="8">
                                                        <input type="text" id={`users-${u.id}`} value={this.state.editQuota[u.id]} onChange={(e)=> { this.onChange(e,u.id)}} className="form-control"/>
                                                    </Col>
                                                    <Col md="4">
                                                        <Row>
                                                            <Col md="6">
                                                            <button onClick={()=>this.onSaveQuota(u.id,u.username,"users")} className="text-success">
                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                            </button>    
                                                            </Col>
                                                            <Col md="6">
                                                            <button onClick={()=>this.onCancelQuota(u.id)} className="text-danger">
                                                                <i className="fa fa-times" aria-hidden="true"></i>
                                                            </button>   
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <div id={`quota-${u.id}`}>     
                                                    <span className="float-right">{u.monthly_quota}
                                                        <button onClick={()=>this.onEditQuota(u.id,u.monthly_quota)} className="text-primary">
                                                            <i className="fa fa-pencil" aria-hidden="true"></i>
                                                        </button>
                                                    </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td>{u.quota_usage_count == null ? 0: u.quota_usage_count}</td>
                                            <td>{u.monthly_quota - u.quota_usage_count}</td>
                                            <td>{u.quota_reset_date == null? 'not-define': u.quota_reset_date}</td>
                                          </tr>)
                                        })}
                                        </tbody>
                                      </table>
                                    </div>

                                </div>
                            )
                        :   (
                                <div className="mb-3">
                                    <Card>
                                        <CardBody>
                                        <h2 className="h2-responsive pb-4">User Quota</h2>
                                        <Table fixed bordered>
                                        <TableHead>
                                            <tr>
                                                <th>User Name</th>
                                                <th>Type</th>
                                                <th>Total Quota</th>
                                                <th>Quota Used</th>
                                                <th>Quota Available</th>
                                                <th>Quota Reset Date,</th>
                                            </tr>
                                        </TableHead>
                                        <TableBody>
                                            <tr>
                                                <td>Driver9</td>
                                                <td>User</td>
                                                <td>123 </td>
                                                <td>12</td>
                                                <td>111</td>
                                                <td>2019-01-14</td>
                                            </tr>
                                        </TableBody>
                                        </Table>
                                        </CardBody>
                                    </Card>
                                </div>
                            )
                }
                    </div>
                )
            }
            </Col>
        </Row>
     </Container>
    )
  }
}

export default Dashboard