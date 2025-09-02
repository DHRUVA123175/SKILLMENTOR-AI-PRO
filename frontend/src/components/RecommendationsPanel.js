import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  BookOpen, 
  Calendar, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Target,
  Clock
} from 'lucide-react';

const RecommendationsPanel = ({ recommendations }) => {
  const [expandedCard, setExpandedCard] = useState(0);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? -1 : index);
  };

  const getDemandColor = (demand) => {
    switch (demand.toLowerCase()) {
      case 'very high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'high':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Career Recommendations</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Personalized paths based on your profile
        </p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {recommendations.map((rec, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Card Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCard(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {rec.career_name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDemandColor(rec.market_demand)}`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {rec.market_demand}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-green-600 font-medium">
                    <DollarSign className="w-4 h-4" />
                    <span>{rec.estimated_salary_range}</span>
                  </div>
                </div>

                <div className="ml-4">
                  {expandedCard === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCard === index && (
              <div className="px-4 pb-4 border-t border-gray-100">
                {/* Reasoning */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {rec.reasoning}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h4>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Must Have:</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.required_skills.must_have.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Good to Have:</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.required_skills.good_to_have.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Resources */}
                {rec.learning_resources && rec.learning_resources.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-medium text-gray-900">Learning Resources</h4>
                    </div>
                    
                    <div className="space-y-2">
                      {rec.learning_resources.map((resource, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded-md">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <a 
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <span>{resource.course_name}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <p className="text-xs text-gray-600 mt-1">
                                {resource.platform} • {resource.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Roadmap */}
                {rec.roadmap && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-medium text-gray-900">Learning Roadmap</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { key: '30_days', label: '30 Days', color: 'green' },
                        { key: '60_days', label: '60 Days', color: 'blue' },
                        { key: '90_days', label: '90 Days', color: 'purple' }
                      ].map(period => {
                        const tasks = rec.roadmap[period.key] || [];
                        if (tasks.length === 0) return null;
                        
                        return (
                          <div key={period.key} className="p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className={`w-3 h-3 text-${period.color}-600`} />
                              <h5 className={`text-xs font-medium text-${period.color}-700`}>
                                {period.label}
                              </h5>
                            </div>
                            <ul className="space-y-1">
                              {tasks.map((task, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className={`w-1.5 h-1.5 bg-${period.color}-400 rounded-full mt-1.5 flex-shrink-0`}></div>
                                  <span className="text-xs text-gray-600">{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPanel;