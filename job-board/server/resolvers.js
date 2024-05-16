import { GraphQLError } from 'graphql'
import {  getCompany } from './db/companies.js'
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
        createJob: (_root,{input:{title,description}}, {user})=>{
            if(!user){
                throw unauthoriedError('missing authentication')
            }
            return createJob({title,description, companyId:user.companyId})
        },
        deleteJob: async (_root,{id},{user})=> {
            if(!user){
                throw unauthoriedError('missing authentication')
            }

            const job = await deleteJob(id,user.companyId)
            if(!job){
                throw notFoundError('No Job found')
            }
            return job;
        },
        updateJob:async(_root,{input:{id,title,description}},{user})=>{
            if(!user){
                throw unauthoriedError('missing authentication')
            }
            const job = await updateJob({id,title,description, companyId:user.companyId})
            if(!job){
                throw notFoundError('No Job Found')
            }
            return job
        }
    },
    Company:{
        jobs:(company)=> getJobsByCompany(company.id),
    }, 
    Job:{
        date: (job)=> toISODate(job.createdAt),
        company:(job,_args,{companyLoader})=> {
            return companyLoader.load(job.companyId)
        }

    }
}

function notFoundError(message){
    return new GraphQLError(message,{
        extensions: {code: 'NOT_FOUND'}
    })
}
function unauthoriedError(message){
    return new GraphQLError(message,{
        extensions: {code: 'UNAUTHORIZED'}
    })
}

function toISODate(value){
    return value.slice(0,'yyyy-mm-dd'.length)
}