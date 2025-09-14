import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectOverviewTable = ({ projects, onApproveProject, onReviewProject }) => {
  const [sortField, setSortField] = useState('submissionDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'under_review':
        return 'text-accent bg-accent/10';
      case 'rejected':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'under_review':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const filteredProjects = projects?.filter(project => 
    filterStatus === 'all' || project?.verificationStatus === filterStatus
  );

  const sortedProjects = [...filteredProjects]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'submissionDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Project Overview</h3>
            <p className="text-sm text-muted-foreground">
              Manage and review submitted carbon credit projects
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('ngoName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>NGO Submitter</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('projectType')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Project Type</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('submissionDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Submission Date</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProjects?.map((project) => (
              <tr key={project?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Building2" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{project?.ngoName}</div>
                      <div className="text-xs text-muted-foreground">{project?.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{project?.projectType}</div>
                  <div className="text-xs text-muted-foreground">{project?.area} hectares</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {new Date(project.submissionDate)?.toLocaleDateString('en-US')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project?.verificationStatus)}`}>
                    {getStatusLabel(project?.verificationStatus)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReviewProject(project?.id)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      Review
                    </Button>
                    {project?.verificationStatus === 'under_review' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onApproveProject(project?.id)}
                        iconName="Check"
                        iconPosition="left"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {sortedProjects?.map((project) => (
          <div key={project?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Building2" size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{project?.ngoName}</div>
                  <div className="text-xs text-muted-foreground">{project?.location}</div>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project?.verificationStatus)}`}>
                {getStatusLabel(project?.verificationStatus)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <div className="text-foreground">{project?.projectType}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Area:</span>
                <div className="text-foreground">{project?.area} hectares</div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Submitted:</span>
                <div className="text-foreground">
                  {new Date(project.submissionDate)?.toLocaleDateString('en-US')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReviewProject(project?.id)}
                iconName="Eye"
                iconPosition="left"
                fullWidth
              >
                Review
              </Button>
              {project?.verificationStatus === 'under_review' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onApproveProject(project?.id)}
                  iconName="Check"
                  iconPosition="left"
                  fullWidth
                >
                  Approve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {sortedProjects?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Projects Found</h3>
          <p className="text-muted-foreground">
            {filterStatus === 'all' ?'No projects have been submitted yet.' 
              : `No projects with ${getStatusLabel(filterStatus)?.toLowerCase()} status found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectOverviewTable;