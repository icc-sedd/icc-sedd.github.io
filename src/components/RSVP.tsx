import React, { useState, useEffect } from 'react';
import SimpleGoogleSheetsService, { GuestReservation } from '../services/simpleGoogleSheetsService';
import RSVPServiceSimplified, { RSVPResponse } from '../services/rsvpServiceSimplified';

const RSVP: React.FC = () => {
  const [guest, setGuest] = useState<GuestReservation | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [attendeeNames, setAttendeeNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [existingRSVP, setExistingRSVP] = useState<RSVPResponse | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Extract GuestID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('GuestID');

    if (id) {
      setGuestId(id);
      lookupGuestById(id);
    }
  }, []);

  useEffect(() => {
    // Prevent body scroll when form modal is open
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);

  const lookupGuestById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setGuest(null);
    setExistingRSVP(null);
    
    // Clear any cached session data for this guest to get fresh data
    sessionStorage.removeItem(`rsvp_${id}`);

    try {
      const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID || '';
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
      const endpoint = process.env.REACT_APP_RSVP_ENDPOINT || '';

      if (!sheetId || !apiKey) {
        throw new Error('Google API configuration missing');
      }

      const service = new SimpleGoogleSheetsService(sheetId, apiKey);
      const foundGuest = await service.findGuestById(id);

      if (foundGuest) {
        setGuest(foundGuest);
        // Initialize attendee names array with empty strings
        setAttendeeNames(new Array(foundGuest.seats + foundGuest.kidsSeats).fill(''));

        // Check if guest already has an RSVP
        const rsvpService = new RSVPServiceSimplified(sheetId, apiKey, endpoint);
        await rsvpService.initialize();
        const existingResponse = await rsvpService.checkExistingResponse('RSVP Response', id);

        if (existingResponse && existingResponse.attendeeNames && existingResponse.attendeeNames.length > 0) {
          setExistingRSVP(existingResponse);
          // Pre-fill the form with existing attendee names
          setAttendeeNames(existingResponse.attendeeNames);
        }
      } else {
        setError(`Guest not found with ID: ${id}`);
      }
    } catch (err) {
      console.error('Guest lookup error:', err);
      setError('Error loading your seat allocation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendeeNameChange = (index: number, value: string) => {
    const updatedNames = [...attendeeNames];
    updatedNames[index] = value;
    setAttendeeNames(updatedNames);
  };

  const handleSubmitRSVP = async () => {
    // Validate that all names are filled
    if (attendeeNames.some(name => !name.trim())) {
      setError('Please fill in all attendee names');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID || '';
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
      const endpoint = process.env.REACT_APP_RSVP_ENDPOINT || '';

      if (!sheetId || !apiKey) {
        throw new Error('Google Sheet ID or API Key configuration missing');
      }

      const rsvpService = new RSVPServiceSimplified(sheetId, apiKey, endpoint);
      await rsvpService.initialize();

      const response: RSVPResponse = {
        guestId: guestId || '',
        guestName: guest?.name || '',
        attendeeNames: attendeeNames,
        attending: 'Yes' // Set attending to Yes when submitting form
      };

      let success = false;

      if (existingRSVP && isUpdating) {
        // Update existing RSVP
        success = await rsvpService.updateRSVPResponse('RSVP Response', response, 0);
        console.log('✏️ RSVP Updated for guest:', guestId);
      } else {
        // Submit new RSVP
        success = await rsvpService.submitRSVPResponse('RSVP Response', response);
        console.log('✅ New RSVP submitted for guest:', guestId);
      }

      if (success) {
        setSubmitSuccess(true);
        setShowForm(false);
        setExistingRSVP(response); // Update the existing RSVP state
        setIsUpdating(false);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setError('Failed to submit RSVP response');
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      setError('Error submitting RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineRSVP = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID || '';
      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
      const endpoint = process.env.REACT_APP_RSVP_ENDPOINT || '';

      if (!sheetId || !apiKey) {
        throw new Error('Google Sheet ID or API Key configuration missing');
      }

      const rsvpService = new RSVPServiceSimplified(sheetId, apiKey, endpoint);
      await rsvpService.initialize();

      // Create a decline response with empty attendee names and Attending = No
      const declineResponse: RSVPResponse = {
        guestId: guestId || '',
        guestName: guest?.name || '',
        attendeeNames: [], // Empty array for decline
        attending: 'No' // Set attending to No
      };

      let success = false;

      if (existingRSVP && isUpdating) {
        // Update existing RSVP to decline
        success = await rsvpService.updateRSVPResponse('RSVP Response', declineResponse, 0);
        console.log('✏️ RSVP Declined (Updated) for guest:', guestId);
      } else {
        // Submit new decline RSVP
        success = await rsvpService.submitRSVPResponse('RSVP Response', declineResponse);
        console.log('❌ RSVP Declined (New) for guest:', guestId);
      }

      if (success) {
        setSubmitSuccess(true);
        setExistingRSVP(declineResponse);
        setIsUpdating(false);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setError('Failed to submit decline response');
      }
    } catch (err) {
      console.error('RSVP decline error:', err);
      setError('Error submitting decline response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section">
      <div className="container rsvp-container">
        <h1 className="attire-main-title">RSVP</h1>
        <p className="attire-subtitle">
          We have chosen to celebrate our wedding with a small and intimate ceremony,<br />
          surrounded only by our closest family and friends. The favor of your reply is requested.<br />
          Please confirm your attendance to help us finalize the arrangements for our intimate celebration.
        </p>
        {isLoading && (
          <div className="rsvp-message loading">
            <p>Loading your seat allocation...</p>
          </div>
        )}

        {error && (
          <div className="rsvp-message error">
            <p>{error}</p>
          </div>
        )}

        {submitSuccess && (
          <div className="rsvp-message success">
            <p>✅ Your RSVP has been submitted successfully!</p>
          </div>
        )}

        {guest && !showForm && (
          <div className="rsvp-guest-info">
            <h2>Your Allotted Seats</h2>
            <div className="seat-allocation">
              <div className="seat-item">
                <span className="seat-label">Adult Seats:</span>
                <span className="seat-count">{guest.seats}</span>
              </div>
              <div className="seat-item">
                <span className="seat-label">Children Seats:</span>
                <span className="seat-count">{guest.kidsSeats}</span>
              </div>
              <div className="seat-item total">
                <span className="seat-label">Total Seats:</span>
                <span className="seat-count">{guest.seats + guest.kidsSeats}</span>
              </div>
            </div>

            {existingRSVP && (
              <div className="rsvp-existing-info">
                <p className="rsvp-status">✅ You have already submitted your RSVP</p>
                <p className="rsvp-submitted-names">
                  <strong>Attendees:</strong> {existingRSVP.attendeeNames.join(', ')}
                </p>
              </div>
            )}

            <button
              className="rsvp-submit-btn"
              onClick={() => {
                setShowForm(true);
                if (existingRSVP) {
                  setIsUpdating(true);
                }
              }}
              disabled={isSubmitting}
            >
              {existingRSVP ? 'Update RSVP' : 'Yes, Count Me In'}
            </button>

            <button
              className="rsvp-decline-btn"
              onClick={handleDeclineRSVP}
              disabled={isSubmitting}
            >
              Sorry, I cannot make it
            </button>
          </div>
        )}

        {guest && showForm && (
          <div className="rsvp-form-modal">
            <div className="rsvp-form-container">
              <h2>{isUpdating ? 'Update Your RSVP' : 'RSVP Form'}</h2>
              <p className="form-subtitle">Please enter the names of all attendees</p>

              {/* Guest name display (non-editable) */}
              <div className="form-section">
                <label className="form-label">Primary Guest Name</label>
                <div className="form-field-static">
                  {guest.name}
                </div>
              </div>

              {/* Attendee names form */}
              <div className="form-section">
                <label className="form-label">Attendee Names</label>
                <p className="form-hint">Enter the name for each seat (Total: {guest.seats + guest.kidsSeats})</p>

                {attendeeNames.map((name, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-field"
                    placeholder={`Attendee ${index + 1} Name`}
                    value={name}
                    onChange={(e) => handleAttendeeNameChange(index, e.target.value)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {/* Form actions */}
              <div className="form-actions">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setIsUpdating(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="btn-submit"
                  onClick={handleSubmitRSVP}
                  disabled={isSubmitting || attendeeNames.some(name => !name.trim())}
                >
                  {isSubmitting ? (isUpdating ? 'Updating...' : 'Submitting...') : (isUpdating ? 'Update RSVP' : 'Submit RSVP')}
                </button>
              </div>
            </div>
          </div>
        )}

        {!guest && !isLoading && !error && (
          <div className="rsvp-message info">
            <p>Please use your invitation link to view your seat allocation.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RSVP;
