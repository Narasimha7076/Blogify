// if the user clicks on a particluar post or clicks on Add Post

import React, { useCallback } from "react";
import {Button, Input, RTE, Select} from "../index";
import { useForm } from "react-hook-form";
import service from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// post contains all details of a post-title, slug, content, status, featuredImage
function PostForm({post}){
    //console.log(post);
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active'
        }
    });
    const navigate = useNavigate();
    const userData = useSelector((state) => state.userData);
    //console.log(userData);

    // when the form gets submitted
    const submit = async (data) => {
        // if the user wants to update a post
        console.log("hi");
        
        if(post){
            // if there is an image in the data submitted then upload the image to appwrite
            const file = data.image[0] ? await service.uploadFile(data.image[0]) : null

            // if image uploaded then delete the previous image 
            if(file){
                service.deleteFile(post.featuredImage)
            }

            // update the post with new details 
            const dbPost = await service.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined
            })

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
        }
        // user wants to create a new post
        else{
            // if there is an image in the data submitted then upload the image to appwrite
            const file =  data.image[0] ? await service.uploadFile(data.image[0]) : null
             // if image uploaded then add the fileId 
            if(file){
                data.featuredImage = file.$id
                const dbPost = await service.createPost({
                    ...data,
                    userId: userData.$id
                });
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }

            // create a new post and add it to appwrite
            // const dbPost = await service.createPost({
            //     ...data,
            //     userId: userData.$id
            // })
            // if(dbPost){
            //     navigate(`/post/${dbPost.$id}`)
            // }
        }
    }

    // Replace non-alphanumeric characters with "-" in the value
    // useCallback ensures that slugTransform is only recreated if its dependencies change. In this case, the dependencies array is empty ([]), meaning slugTransform is created once and then memoized (i.e., not recreated) for the lifetime of the component. This prevents unnecessary re-creations of the function on every render.
    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string'){
            return value
            .trim()
            .toLocaleLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");
        }
        return "";
    }, [])


    // this is called whenever the dependencies change
    // when the title field is changed we are updating the slug field using setValue
    React.useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === "title"){
                setValue("slug", slugTransform(value.title), {shouldValidate: true})
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue])
    
    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-2/3 px-2">
            <Input
                label="Title :"
                placeholder="Title"
                className="mb-4"
                {...register("title", { required: true })}
            />
            <Input
                label="Slug :"
                placeholder="Slug"
                className="mb-4"
                {...register("slug", { required: true })}
                // if the user tries to type in the slug filed,
                // onInput handler gets triggered and we update the value using setValue
                onInput={(e) => {
                    // e.currentTarget.value gets the current value of the slug input field. 
                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                }}
            />
            {/* The RTE editor shows the data present in the content using getVlues */}
            <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
        </div>
        <div className="w-1/3 px-2">
            <Input
                label="Featured Image :"
                type="file"
                className="mb-4"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
            />
            {post && (
                <div className="w-full mb-4">
                    <img
                        src={service.filePreview(post.featuredImage)}
                        alt={post.title}
                        className="rounded-lg"
                    />
                </div>
            )}
            <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4"
                {...register("status", { required: true })}
            />
            <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                {post ? "Update" : "Submit"}
            </Button>
        </div>
    </form>
    );

}

export default PostForm;