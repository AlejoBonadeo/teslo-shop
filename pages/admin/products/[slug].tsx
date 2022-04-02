import { FC, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { AdminLayout } from "../../../components/layouts";
import { Product as IProduct } from "../../../interfaces";
import {
  DriveFileRenameOutline,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import { dbProducts } from "../../../database";
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ValidTypes, ValidSizes } from "../../../interfaces";
import { tesloApi } from "../../../api";
import { Product } from "../../../models";
import { useRouter } from "next/router";

const validTypes = ["shirts", "pants", "hoodies", "hats"];
const validGender = ["men", "women", "kid", "unisex"];
const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface Props {
  product: IProduct;
}

interface FormData extends IProduct {}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({ defaultValues: product });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "title") {
        setValue(
          "slug",
          value.title
            ?.toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "_") || "",
          { shouldValidate: true }
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onDeleteTag = (tag: string) => {
    const newTags = product.tags.filter((t) => t !== tag);
    setValue("tags", newTags, { shouldValidate: true });
  };

  const onSubmit = async (form: FormData) => {

    if (form.images.length < 2) {
      alert("Please upload at least 2 images");
      return;
    }
    setIsSaving(true);
    try {
      const { data } = await tesloApi({
        url: "/admin/products",
        method: form._id ? "PUT" : "POST",
        data: form,
      });
      if (form._id) {
        return router.replace(`/admin/products/${form.slug}`);
      }
      router.replace(`/admin/products/${data.slug}`);
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };
  const onChangeSize = (size: ValidSizes) => {
    const sizes = getValues("sizes") || [];
    if (sizes.includes(size)) {
      setValue(
        "sizes",
        sizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    } else {
      setValue("sizes", [...sizes, size], { shouldValidate: true });
    }
  };

  return (
    <AdminLayout
      title={"Producto"}
      subtitle={`Editando: ${product.title}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("title", {
                required: "Este campo es requerido",
                minLength: {
                  value: 2,
                  message: "El título debe tener al menos 2 caracteres",
                },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Descripción"
              variant="filled"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register("description", {
                required: "Este campo es requerido",
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Stock"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("inStock", {
                required: "Este campo es requerido",
                min: { value: 0, message: "El stock debe ser mayor a 0" },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("price", {
                required: "Este campo es requerido",
                min: { value: 0, message: "El precio debe ser mayor a 0" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup
                row
                value={getValues("type")}
                onChange={(e) =>
                  setValue("type", e.target.value as ValidTypes, {
                    shouldValidate: true,
                  })
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={getValues("gender")}
                onChange={(e) =>
                  setValue(
                    "gender",
                    e.target.value as "men" | "women" | "kid" | "unisex",
                    {
                      shouldValidate: true,
                    }
                  )
                }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Talles</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox
                      checked={getValues("sizes").includes(size as ValidSizes)}
                    />
                  }
                  label={size}
                  onChange={() => onChangeSize(size as ValidSizes)}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("slug", {
                required: "Este campo es requerido",
                validate: (val) =>
                  val.includes(" ") ? "No puede contener espacios" : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Etiquetas"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para agregar"
              value={newTag}
              onChange={(e) => {
                if (e.target.value[e.target.value.length - 1] === " ") {
                  if (!getValues("tags").includes(newTag.toLowerCase())) {
                    setValue(
                      "tags",
                      [...getValues("tags"), newTag.toLowerCase()],
                      { shouldValidate: true }
                    );
                  }
                  setNewTag("");
                  return;
                }
                setNewTag(e.target.value);
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {getValues("tags").map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current!.click()}
              >
                Cargar imagen
              </Button>
              <input
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    [...e.target.files].forEach((file) => {
                      const formData = new FormData();
                      formData.append("file", file);
                      tesloApi
                        .post("/admin/uploads", formData)
                        .then(({ data }) => {
                          setValue(
                            "images",
                            [...getValues("images"), data.message],
                            { shouldValidate: true }
                          );
                        });
                    });
                  }
                }}
              />
              {
                getValues("images").length < 2 && (
                  <Chip
                    label="Es necesario al 2 imagenes"
                    color="error"
                    variant="outlined"
                  />
                )
              }

              <Grid container spacing={2}>
                {getValues("images").map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component="img"
                        className="fadeIn"
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          fullWidth
                          color="error"
                          onClick={() =>
                            setValue(
                              "images",
                              getValues("images").filter((i) => i !== img), {
                                shouldValidate: true,
                              }
                            )
                          }
                        >
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = "" } = query;

  if (slug === "new") {
    const product = JSON.parse(JSON.stringify(new Product()));
    delete product._id;
    product.images = ["img1.jpg", "img2.jpg"];
    return { props: { product } };
  }

  const product = await dbProducts.getProductBySlug(slug.toString());

  if (!product) {
    return {
      redirect: {
        destination: "/admin/products",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
