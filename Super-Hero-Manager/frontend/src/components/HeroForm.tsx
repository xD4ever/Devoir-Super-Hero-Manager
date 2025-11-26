import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, MenuItem, Typography, Chip, Stack } from '@mui/material';
import { CreateHeroData, Hero } from '../types/Hero';

interface HeroFormProps {
    initialValues?: Hero;
    onSubmit: (values: CreateHeroData) => Promise<void>;
    submitLabel: string;
}

const validationSchema = Yup.object({
    nom: Yup.string().required('Name is required'),
    alias: Yup.string().required('Alias is required'),
    univers: Yup.string().oneOf(['Marvel', 'DC', 'Autre']).required('Univers is required'),
    pouvoirs: Yup.array().of(Yup.string()).min(1, 'At least one power is required'),
    description: Yup.string(),
    origine: Yup.string(),
    premiereApparition: Yup.date().nullable(),
});

const HeroForm: React.FC<HeroFormProps> = ({ initialValues, onSubmit, submitLabel }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(() => {
        if (!initialValues?.image) return null;
        if (initialValues.image.startsWith('http')) return initialValues.image;
        
        let cleanPath = initialValues.image.startsWith('/') ? initialValues.image.substring(1) : initialValues.image;
        if (cleanPath.match(/^(md|sm|xs|lg)\//)) {
            cleanPath = `uploads/images/${cleanPath}`;
        } else if (!cleanPath.startsWith('uploads/')) {
            cleanPath = `uploads/${cleanPath}`;
        }
        return `http://localhost:5001/${cleanPath.replace(/\\/g, '/')}`;
    });
    const [powerInput, setPowerInput] = useState('');

    const formik = useFormik({
        initialValues: {
            nom: initialValues?.nom || '',
            alias: initialValues?.alias || '',
            univers: initialValues?.univers || 'Marvel',
            pouvoirs: initialValues?.pouvoirs || [],
            description: initialValues?.description || '',
            origine: initialValues?.origine || '',
            premiereApparition: initialValues?.premiereApparition ? new Date(initialValues.premiereApparition).toISOString().split('T')[0] : '',
            image: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values as unknown as CreateHeroData);
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            formik.setFieldValue('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddPower = () => {
        if (powerInput.trim()) {
            formik.setFieldValue('pouvoirs', [...formik.values.pouvoirs, powerInput.trim()]);
            setPowerInput('');
        }
    };

    const handleDeletePower = (powerToDelete: string) => {
        formik.setFieldValue('pouvoirs', formik.values.pouvoirs.filter((power) => power !== powerToDelete));
    };

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                fullWidth
                id="nom"
                label="Name"
                name="nom"
                value={formik.values.nom}
                onChange={formik.handleChange}
                error={formik.touched.nom && Boolean(formik.errors.nom)}
                helperText={formik.touched.nom && formik.errors.nom}
            />
            <TextField
                margin="normal"
                fullWidth
                id="alias"
                label="Alias"
                name="alias"
                value={formik.values.alias}
                onChange={formik.handleChange}
                error={formik.touched.alias && Boolean(formik.errors.alias)}
                helperText={formik.touched.alias && formik.errors.alias}
            />
            <TextField
                margin="normal"
                fullWidth
                select
                id="univers"
                label="Univers"
                name="univers"
                value={formik.values.univers}
                onChange={formik.handleChange}
                error={formik.touched.univers && Boolean(formik.errors.univers)}
                helperText={formik.touched.univers && formik.errors.univers}
            >
                <MenuItem value="Marvel">Marvel</MenuItem>
                <MenuItem value="DC">DC</MenuItem>
                <MenuItem value="Autre">Autre</MenuItem>
            </TextField>

            <Box sx={{ mt: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        label="Add Power"
                        value={powerInput}
                        onChange={(e) => setPowerInput(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleAddPower}>Add</Button>
                </Box>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                    {formik.values.pouvoirs.map((power, index) => (
                        <Chip
                            key={index}
                            label={power}
                            onDelete={() => handleDeletePower(power)}
                        />
                    ))}
                </Stack>
                {formik.touched.pouvoirs && formik.errors.pouvoirs && (
                    <Typography color="error" variant="caption">{formik.errors.pouvoirs as string}</Typography>
                )}
            </Box>

            <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="origine"
                label="Origine"
                name="origine"
                value={formik.values.origine}
                onChange={formik.handleChange}
            />
            <TextField
                margin="normal"
                fullWidth
                id="premiereApparition"
                label="Premiere Apparition"
                name="premiereApparition"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.premiereApparition}
                onChange={formik.handleChange}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
                <Button variant="contained" component="label">
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    </Box>
                )}
            </Box>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                {submitLabel}
            </Button>
        </Box>
    );
};

export default HeroForm;
