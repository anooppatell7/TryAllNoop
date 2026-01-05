
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MockDataGen from './pages/MockDataGen';
import RegexBuilder from './pages/RegexBuilder';
import CodeSimplifier from './pages/CodeSimplifier';
import CronGen from './pages/CronGen';
import JsonToTypes from './pages/JsonToTypes';
import ReadmeGen from './pages/ReadmeGen';
import CommitMsgGen from './pages/CommitMsgGen';
import SqlToNoSql from './pages/SqlToNoSql';
import OgImageGen from './pages/OgImageGen';
import Docs from './pages/Docs';
import GithubOnboarding from './pages/GithubOnboarding';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="mock-data" element={<MockDataGen />} />
          <Route path="regex" element={<RegexBuilder />} />
          <Route path="simplify" element={<CodeSimplifier />} />
          <Route path="cron" element={<CronGen />} />
          <Route path="json-types" element={<JsonToTypes />} />
          <Route path="readme" element={<ReadmeGen />} />
          <Route path="commit-msg" element={<CommitMsgGen />} />
          <Route path="sql-nosql" element={<SqlToNoSql />} />
          <Route path="og-image" element={<OgImageGen />} />
          <Route path="github-push" element={<GithubOnboarding />} />
          <Route path="docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
