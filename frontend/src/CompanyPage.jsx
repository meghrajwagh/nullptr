import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { analyzeCompany } from './services/api'

export default function CompanyPage() {
  const { company } = useParams();

  useEffect(() => {
    console.log(company);
    analyzeCompany(company).then((result) => {
      console.log(result);
    });
  })

  return (
    <div>CompanyPage</div>
  )
}
