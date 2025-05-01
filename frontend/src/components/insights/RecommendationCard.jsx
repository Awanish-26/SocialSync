import React from 'react';
import { FiZap } from 'react-icons/fi';
import Card from '../ui/Card';

function RecommendationCard({ recommendations, className = '' }) {
  return (
    <Card
      title="Recommendations"
      className={`bg-gradient-to-br from-purple-50 to-blue-50 ${className}`}
      headerClassName="border-b-0 pb-2"
    >
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex">
            <div className="flex-shrink-0 pt-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                <FiZap className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecommendationCard;