import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../Components/Modal';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import { validateJoinRequest } from '../../validator/joinRequestValidator';
import { useCreateJoinRequest } from '../../hooks/useJoinRequests';

const initialFormState = {
  fullName: '',
  email: '',
  studentId: '',
  message: '',
};

const JoinRequestModal = ({ isOpen, onClose, societySlug, societyName }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const createJoinRequest = useCreateJoinRequest(societySlug);

  const helperText = useMemo(
    () => `Submit your request to join ${societyName}. Admin will review it and approve enrollment.`,
    [societyName]
  );

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = validateJoinRequest(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    createJoinRequest.mutate(formData, {
      onSuccess: () => {
        setErrors({});
        setFormData(initialFormState);
        onClose();
      },
    });
  };

  const handleClose = useCallback(() => {
    if (createJoinRequest.isPending) return;
    setErrors({});
    onClose();
  }, [createJoinRequest.isPending, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Request To Join Society"
      size="lg"
      className="bg-white border border-gray-200"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted">{helperText}</p>

        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          error={errors.fullName}
          required
          placeholder="Enter your full name"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
          placeholder="name@example.com"
        />

        <Input
          label="Student ID"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange('studentId')}
          error={errors.studentId}
          required
          placeholder="Ex: STU2024123456"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-primary">
            Why Do You Want To Join? <span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange('message')}
            placeholder="Tell us your interest, background, and what you will contribute."
            className="w-full rounded-lg bg-white border px-4 py-3 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-colors min-h-[120px] resize-y leading-relaxed border-border focus:border-accent"
          />
          {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
        </div>

        <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={createJoinRequest.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            loading={createJoinRequest.isPending}
          >
            Submit Join Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

JoinRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  societySlug: PropTypes.string.isRequired,
  societyName: PropTypes.string.isRequired,
};

export default JoinRequestModal;
