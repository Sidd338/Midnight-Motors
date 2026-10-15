import React, { useEffect } from 'react';

export function KeywordResearchTable({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <div style={{ width: '100%' }}>
      {showTitle && (
        <h1
          style={{
            color: '#F2F5FA',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            textAlign: 'left',
            fontFamily: "'Open Sans', Arial, sans-serif"
          }}
        >
          Keyword Research Table: Midnight Motors
        </h1>
      )}

      {/* Responsive wrapper */}
      <div
        style={{
          overflowX: 'auto',
          width: '100%',
          marginBottom: '16px'
        }}
      >
        {/* Real HTML table */}
        <table
          style={{
            width: '100%',
            backgroundColor: '#111B2E',
            borderCollapse: 'collapse',
            borderSpacing: 0,
            fontSize: '15px',
            lineHeight: '1.5',
            fontFamily: "'Open Sans', Arial, sans-serif"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#1C2B47' }}>
              <th
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#F2F5FA',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                Page
              </th>
              <th
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#F2F5FA',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                Main keyword
              </th>
              <th
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#F2F5FA',
                  fontWeight: 'bold'
                }}
              >
                2 related keywords
              </th>
              <th
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#F2F5FA',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                Intent
              </th>
              <th
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#F2F5FA',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                Volume
              </th>
              <th
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#F2F5FA',
                  fontWeight: 'bold'
                }}
              >
                Question it answers
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1: Home */}
            <tr>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                Home
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                hypercars showroom
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                exotic supercars collection; luxury car showroom
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                Do
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  whiteSpace: 'nowrap'
                }}
              >
                [...] (2,400/mo)
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                Where can I see rare hypercars and supercars?
              </td>
            </tr>

            {/* Row 2: Article 1 */}
            <tr>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                Article 1 (What is a hypercar)
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                what is a hypercar
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                hypercar vs supercar; fastest hypercars in the world
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                Know
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  whiteSpace: 'nowrap'
                }}
              >
                [...] (4,400/mo)
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                What is the difference between a hypercar and a supercar?
              </td>
            </tr>

            {/* Row 3: Article 2 */}
            <tr>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                Article 2 (Classic cars)
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                best classic cars to invest in
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                exotic classic cars; vintage car collection
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                Know
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  whiteSpace: 'nowrap'
                }}
              >
                [...] (3,600/mo)
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                Which classic cars are worth investing in?
              </td>
            </tr>

            {/* Row 4: Article 3 */}
            <tr>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                Article 3 (Motorcycles)
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                luxury motorcycles
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                superbikes collection; best luxury bikes in the world
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                Know
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4',
                  whiteSpace: 'nowrap'
                }}
              >
                [...] (6,600/mo)
              </td>
              <td
                style={{
                  border: '1px solid #3A4D70',
                  padding: '10px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  color: '#E3E9F4'
                }}
              >
                What are the best luxury motorcycles in the world?
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Small line below the table */}
      <p
        style={{
          fontSize: '13px',
          color: '#A0B2D1',
          margin: '12px 0 0 0',
          fontFamily: "'Open Sans', Arial, sans-serif"
        }}
      >
        Intent: Know = wants information, Do = wants to act, Go = wants a place.
      </p>
    </div>
  );
}

export function KeywordResearchPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  useEffect(() => {
    // Set noindex meta tag for this page only
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = 'noindex';

    // Set page title
    const prevTitle = document.title;
    document.title = 'Keyword Research Table: Midnight Motors';

    return () => {
      // Revert robots meta tag on unmount
      if (robotsMeta) {
        robotsMeta.content = 'index, follow';
      }
      document.title = prevTitle;
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#0A0F1C',
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: '40px 20px',
        boxSizing: 'border-box',
        fontFamily: "'Open Sans', Arial, sans-serif",
        color: '#E3E9F4'
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          width: '90%',
          margin: '0 auto'
        }}
      >
        {/* Navigation back option */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={onNavigateHome}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3A4D70',
              cursor: 'pointer',
              fontFamily: "'Open Sans', Arial, sans-serif",
              fontSize: '13px',
              padding: 0,
              textDecoration: 'none'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#8ea7d1')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3A4D70')}
          >
            ← Back to Midnight Motors Showroom
          </button>
        </div>

        {/* Heading & Table */}
        <KeywordResearchTable showTitle={true} />
      </div>
    </div>
  );
}
