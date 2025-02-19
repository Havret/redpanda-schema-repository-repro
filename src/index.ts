// Importing required libraries and modules
import {
    SerdeType,
    ClientConfig,
    SchemaRegistryClient,
    ProtobufSerializer,
    ProtobufDeserializer,
} from "@confluentinc/schemaregistry"; // Confluent Schema Registry for managing schemas for Kafka topics
import { CreateAxiosDefaults } from "axios"; // Axios configuration for HTTP client defaults
import { MyMessage, MyMessageSchema } from "./my_schema_pb";
// Protobuf schema and generated classes for a specific "Permission" domain
import { create } from "@bufbuild/protobuf"; // Helper to create instances of Protobuf message classes

async function testSchemaRegistry() {
    const createAxiosDefaults: CreateAxiosDefaults = {
        timeout: 10000,
    };

    const clientConfig: ClientConfig = {
        baseURLs: ["http://localhost:18081"], // redpanda schema registry
        // baseURLs: ["http://localhost:8081"], // kafka schema registry
        createAxiosDefaults: createAxiosDefaults,
        cacheCapacity: 512,
        cacheLatestTtlSecs: 60,
    };

    const schemaRegistryClient = new SchemaRegistryClient(clientConfig);

    const deserializer = new ProtobufDeserializer(
        schemaRegistryClient,
        SerdeType.VALUE,
        {});

    const serializer = new ProtobufSerializer(schemaRegistryClient, SerdeType.VALUE, {
        autoRegisterSchemas: true // Automatically register schemas if they are not already registered
    });

    const topicName = "My_Schema";

    const message: MyMessage = create(MyMessageSchema, {
        myProperty: 0.5
    });

    serializer.registry.add(MyMessageSchema);

    let bytes: Buffer<ArrayBufferLike> | null = null;
    try {
        bytes = await serializer.serialize(topicName, message);
    } catch (error) {
        console.error("Error while serializing message:", error);
    }

    // Deserialize the received Protobuf message
    if (bytes == null) {
        return;
    }

    try {
        const deserialized: MyMessage = await deserializer.deserialize(
            topicName,
            bytes
        );

        console.log(JSON.stringify(deserialized));
    } catch (error) {
        console.error("Error while deserializing message:", error);
    }
}


testSchemaRegistry();