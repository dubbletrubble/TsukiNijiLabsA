import React from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { theme } from '../../styles/theme';

const AdminLink = styled(Link)`
  color: ${theme.colors.accent};
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-decoration: underline;
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

// Simple component that always shows the admin link (in development environment)
export default function AdminFooterLink() {
  return <AdminLink to="/admin">Admin Panel</AdminLink>;
}
