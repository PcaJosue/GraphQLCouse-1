import { GraphQLError } from 'graphql'
import { getCompany } from './db/companies.js'
import {getJob, getJobsByCompany, getJobs, createJob, deleteJob, updateJob} from './db/jobs.js'

export const resolvers ={
    Query:{
        company: async(_root,{id})=> {
           const company= await getCompany(id)
           if(!company){
            throw notFoundError('No Company found with id'+id) 
           }
           return company
        },
        job: async (_root,{id}) =>  {
            const job = await getJob(id)
            if(!job){
                throw notFoundError('No Job found with id'+id)
            }
            return job
        },
        jobs : ()=> getJobs()
    },
    Mutation:{
        createJob: (_root,{input:{title,description}})=>{
            const companyId = "FjcJCHJALA4i" //TODO set based on user
            return createJob({title,description, companyId:companyId})
        },
        deleteJob:(_root,{id})=> deleteJob(id),
        updateJob:(_root,{input:{id,title,description}})=>{
            return updateJob({id,title,description})
        }
    },
    Company:{
        jobs:(company)=> getJobsByCompany(company.id),
    }, 
    Job:{
        date: (job)=> toISODate(job.createdAt),
        company:(job)=> getCompany(job.companyId)

    }
}

function notFoundError(message){
    return new GraphQLError(message,{
        extensions: {code: 'NOT_FOUND'}
    })
}

function toISODate(value){
    return value.slice(0,'yyyy-mm-dd'.length)
}