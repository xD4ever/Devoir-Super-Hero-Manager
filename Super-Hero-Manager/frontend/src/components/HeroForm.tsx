import { useEffect, useMemo, useState, FocusEvent } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Hero } from '../types/Hero';

interface HeroFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialHero?: Hero;
  submitLabel?: string;
}

interface HeroFormValues {
  nom: string;
  alias: string;
  univers: Hero['univers'];
  pouvoirs: string;
  description: string;
  origine: string;
  premiereApparition: string;
  image: File | null;
}

const heroSchema = Yup.object().shape({
  nom: Yup.string().required('Nom requis'),
  alias: Yup.string().required('Alias requis'),
  univers: Yup.mixed<Hero['univers']>()
    .oneOf(['Marvel', 'DC', 'Autre'])
    .required('Univers requis'),
  pouvoirs: Yup.string().required('Les pouvoirs sont requis'),
  description: Yup.string().max(1000, 'Description trop longue'),
  origine: Yup.string().max(255, 'Origine trop longue'),
  premiereApparition: Yup.string().nullable(),
});

const HeroForm = ({ onSubmit, initialHero, submitLabel }: HeroFormProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const initialValues: HeroFormValues = useMemo(
    () => ({
      nom: initialHero?.nom ?? '',
      alias: initialHero?.alias ?? '',
      univers: initialHero?.univers ?? 'Autre',
      pouvoirs: initialHero?.pouvoirs?.join(', ') ?? '',
      description: initialHero?.description ?? '',
      origine: initialHero?.origine ?? '',
      premiereApparition: initialHero?.premiereApparition
        ? new Date(initialHero.premiereApparition).toISOString().slice(0, 10)
        : '',
      image: null,
    }),
    [initialHero],
  );

  useEffect(() => {
    if (initialHero?.image) {
      setPreview(initialHero.image);
    }
  }, [initialHero]);

  const handleSubmit = async (
    values: HeroFormValues,
    helpers: FormikHelpers<HeroFormValues>,
  ) => {
    const formData = new FormData();
    formData.append('nom', values.nom);
    formData.append('alias', values.alias);
    formData.append('univers', values.univers);
    formData.append(
      'pouvoirs',
      JSON.stringify(
        values.pouvoirs
          .split(',')
          .map(p => p.trim())
          .filter(Boolean),
      ),
    );
    if (values.description) formData.append('description', values.description);
    if (values.origine) formData.append('origine', values.origine);
    if (values.premiereApparition)
      formData.append('premiereApparition', values.premiereApparition);
    if (values.image) formData.append('image', values.image);

    await onSubmit(formData);
    helpers.setSubmitting(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFieldValue('image', file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(initialHero?.image ?? null);
    }
  };

  const handleTrim = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.value = e.target.value.trim();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={heroSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="hero-form">
          <div className="form-row">
            <label>
              Nom *
              <Field name="nom" onBlur={handleTrim} />
              <ErrorMessage component="div" className="error" name="nom" />
            </label>
            <label>
              Alias *
              <Field name="alias" onBlur={handleTrim} />
              <ErrorMessage component="div" className="error" name="alias" />
            </label>
          </div>

          <div className="form-row">
            <label>
              Univers *
              <Field as="select" name="univers">
                <option value="Marvel">Marvel</option>
                <option value="DC">DC</option>
                <option value="Autre">Autre</option>
              </Field>
              <ErrorMessage component="div" className="error" name="univers" />
            </label>
            <label>
              Pouvoirs (séparés par des virgules) *
              <Field
                name="pouvoirs"
                placeholder="Force, Vol, Télépathie…"
                onBlur={handleTrim}
              />
              <ErrorMessage component="div" className="error" name="pouvoirs" />
            </label>
          </div>

          <label>
            Description
            <Field
              as="textarea"
              name="description"
              rows={4}
              onBlur={handleTrim}
            />
            <ErrorMessage
              component="div"
              className="error"
              name="description"
            />
          </label>

          <div className="form-row">
            <label>
              Origine
              <Field name="origine" onBlur={handleTrim} />
              <ErrorMessage component="div" className="error" name="origine" />
            </label>
            <label>
              Première apparition
              <Field type="date" name="premiereApparition" />
              <ErrorMessage
                component="div"
                className="error"
                name="premiereApparition"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Image
              <input
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e, setFieldValue)}
              />
            </label>
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Prévisualisation" />
              </div>
            )}
          </div>

          <button type="submit" className="btn primary" disabled={isSubmitting}>
            {submitLabel ?? 'Enregistrer'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default HeroForm;
